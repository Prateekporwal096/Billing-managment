import { useState } from 'react';
import { ShoppingCart, Plus, Trash2, Printer, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDataStore } from '@/stores/dataStore';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import { Invoice, InvoiceItem } from '@/types';

export default function Billing() {
  const { products, customers, addInvoice, addStockMovement, updateProduct, invoices } = useDataStore();
  const { toast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [isInterState, setIsInterState] = useState(false);

  const addItem = () => {
    setItems([
      ...items,
      { productId: '', productName: '', quantity: 1, price: 0, gstRate: 18 },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'productId') {
      const product = products.find((p) => p.id === value);
      if (product) {
        newItems[index].productName = product.name;
        newItems[index].price = product.price;
        newItems[index].gstRate = product.gstRate;
      }
    }

    setItems(newItems);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    items.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      const gstAmount = (itemTotal * item.gstRate) / 100;

      if (isInterState) {
        igst += gstAmount;
      } else {
        cgst += gstAmount / 2;
        sgst += gstAmount / 2;
      }
    });

    const total = subtotal + cgst + sgst + igst;

    return { subtotal, cgst, sgst, igst, total };
  };

  const generateInvoice = () => {
    if (!selectedCustomer) {
      toast({
        title: 'Error',
        description: 'Please select a customer',
        variant: 'destructive',
      });
      return;
    }

    if (items.length === 0 || items.some((item) => !item.productId)) {
      toast({
        title: 'Error',
        description: 'Please add at least one valid product',
        variant: 'destructive',
      });
      return;
    }

    // Check stock availability
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (product && product.stock < item.quantity) {
        toast({
          title: 'Error',
          description: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
          variant: 'destructive',
        });
        return;
      }
    }

    const customer = customers.find((c) => c.id === selectedCustomer);
    const { subtotal, cgst, sgst, igst, total } = calculateTotals();

    const invoiceNumber = `INV${new Date()
      .toISOString()
      .slice(2, 10)
      .replace(/-/g, '')}${(invoices.length + 1).toString().padStart(3, '0')}`;

    const invoice: Invoice = {
      id: invoiceNumber,
      customerId: selectedCustomer,
      customerName: customer?.name || '',
      items: items,
      subtotal,
      cgst,
      sgst,
      igst,
      total,
      date: new Date().toISOString().split('T')[0],
      status: 'paid',
    };

    addInvoice(invoice);

    // Update stock and add stock movements
    items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        updateProduct(item.productId, { stock: product.stock - item.quantity });
        addStockMovement({
          id: Date.now().toString() + Math.random(),
          productId: item.productId,
          productName: item.productName,
          type: 'sale',
          quantity: item.quantity,
          date: new Date().toISOString().split('T')[0],
          reference: invoiceNumber,
        });
      }
    });

    toast({
      title: 'Success',
      description: `Invoice ${invoiceNumber} generated successfully`,
    });

    // Reset form
    setSelectedCustomer('');
    setItems([]);
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
          <ShoppingCart className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Billing & Invoice</h1>
          <p className="text-muted-foreground">Create new invoices with GST calculation</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-lg space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Customer *</Label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tax Type</Label>
                <Select
                  value={isInterState ? 'igst' : 'cgst-sgst'}
                  onValueChange={(value) => setIsInterState(value === 'igst')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cgst-sgst">CGST + SGST (Same State)</SelectItem>
                    <SelectItem value="igst">IGST (Inter State)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Items</h2>
              <Button onClick={addItem} size="sm" className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-3 p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="col-span-5">
                    <Label className="text-xs">Product</Label>
                    <Select
                      value={item.productId}
                      onValueChange={(value) => updateItem(index, 'productId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} (Stock: {product.stock})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Qty</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Price</Label>
                    <Input type="number" value={item.price} disabled className="bg-white/5" />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Total</Label>
                    <Input
                      value={formatCurrency(item.price * item.quantity)}
                      disabled
                      className="bg-white/5 font-semibold"
                    />
                  </div>
                  <div className="col-span-1 flex items-end">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No items added. Click "Add Item" to start.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-lg space-y-4 sticky top-24">
            <h2 className="text-xl font-semibold">Invoice Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
              </div>

              {!isInterState ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CGST</span>
                    <span className="font-medium">{formatCurrency(totals.cgst)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SGST</span>
                    <span className="font-medium">{formatCurrency(totals.sgst)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IGST</span>
                  <span className="font-medium">{formatCurrency(totals.igst)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-white/10 flex justify-between text-lg">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-primary">{formatCurrency(totals.total)}</span>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <Button onClick={generateInvoice} className="w-full bg-gradient-primary">
                <Save className="h-4 w-4 mr-2" />
                Generate Invoice
              </Button>
              <Button variant="outline" className="w-full" disabled={items.length === 0}>
                <Printer className="h-4 w-4 mr-2" />
                Print Preview
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
