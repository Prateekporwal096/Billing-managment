import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Customer, Invoice, StockMovement } from '@/types';

interface DataState {
  products: Product[];
  customers: Customer[];
  invoices: Invoice[];
  stockMovements: StockMovement[];
  
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (productId: string, quantity: number, type: 'sale' | 'purchase' | 'adjustment', reference?: string) => void;
  
  // Customer actions
  addCustomer: (customer: Omit<Customer, 'id' | 'totalPurchases' | 'createdAt'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  // Invoice actions
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>) => void;
  deleteInvoice: (id: string) => void;
  getNextInvoiceNumber: () => string;
  
  // Stock Movement actions
  addStockMovement: (movement: StockMovement) => void;
}

// Mock initial data
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Laptop',
    category: 'Electronics',
    sku: 'LAP-001',
    hsnCode: '8471',
    price: 45000,
    gstRate: 18,
    stock: 25,
    minStockLevel: 5,
    supplierName: 'Tech Distributors Ltd',
    unit: 'piece',
    description: 'High-performance laptop for business',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    category: 'Electronics',
    sku: 'MOU-001',
    hsnCode: '8471',
    price: 800,
    gstRate: 18,
    stock: 150,
    minStockLevel: 20,
    supplierName: 'Tech Distributors Ltd',
    unit: 'piece',
    description: 'Ergonomic wireless mouse',
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: '3',
    name: 'Office Chair',
    category: 'Furniture',
    sku: 'CHR-001',
    hsnCode: '9401',
    price: 5500,
    gstRate: 18,
    stock: 8,
    minStockLevel: 10,
    supplierName: 'Furniture World',
    unit: 'piece',
    description: 'Ergonomic office chair with lumbar support',
    createdAt: new Date('2024-01-08').toISOString(),
    updatedAt: new Date('2024-01-08').toISOString(),
  },
  {
    id: '4',
    name: 'Printing Paper A4',
    category: 'Stationery',
    sku: 'PAP-001',
    hsnCode: '4802',
    price: 250,
    gstRate: 12,
    stock: 200,
    minStockLevel: 50,
    supplierName: 'Paper Supplies Co',
    unit: 'ream',
    description: 'Premium quality A4 paper',
    createdAt: new Date('2024-01-05').toISOString(),
    updatedAt: new Date('2024-01-05').toISOString(),
  },
  {
    id: '5',
    name: 'LED Monitor 24"',
    category: 'Electronics',
    sku: 'MON-001',
    hsnCode: '8528',
    price: 9500,
    gstRate: 18,
    stock: 3,
    minStockLevel: 5,
    supplierName: 'Tech Distributors Ltd',
    unit: 'piece',
    description: 'Full HD LED monitor',
    createdAt: new Date('2024-01-12').toISOString(),
    updatedAt: new Date('2024-01-12').toISOString(),
  },
];

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91 98765 43210',
    address: 'Mumbai, Maharashtra',
    state: 'Maharashtra',
    totalPurchases: 125000,
    lastPurchaseDate: new Date('2026-01-25').toISOString(),
    createdAt: new Date('2024-06-15').toISOString(),
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 87654 32109',
    gstNumber: '27AABCU9603R1ZM',
    address: 'Pune, Maharashtra',
    state: 'Maharashtra',
    totalPurchases: 85000,
    lastPurchaseDate: new Date('2026-01-20').toISOString(),
    createdAt: new Date('2024-08-10').toISOString(),
  },
];

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      products: MOCK_PRODUCTS,
      customers: MOCK_CUSTOMERS,
      invoices: [],
      stockMovements: [],

      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ products: [...state.products, newProduct] }));
      },

      updateProduct: (id, productData) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...productData, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      updateStock: (productId, quantity, type, reference) => {
        const product = get().products.find((p) => p.id === productId);
        if (!product) return;

        const stockChange = type === 'sale' ? -quantity : quantity;
        const newStock = product.stock + stockChange;

        // Update product stock
        get().updateProduct(productId, { stock: newStock });

        // Add stock movement record
        const movement: StockMovement = {
          id: Date.now().toString(),
          productId,
          productName: product.name,
          type,
          quantity,
          balanceAfter: newStock,
          reference,
          createdBy: 'admin',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          stockMovements: [movement, ...state.stockMovements],
        }));
      },

      addCustomer: (customerData) => {
        const newCustomer: Customer = {
          ...customerData,
          id: Date.now().toString(),
          totalPurchases: 0,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ customers: [...state.customers, newCustomer] }));
      },

      updateCustomer: (id, customerData) => {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id ? { ...c, ...customerData } : c
          ),
        }));
      },

      deleteCustomer: (id) => {
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id),
        }));
      },

      getNextInvoiceNumber: () => {
        const invoices = get().invoices;
        const today = new Date();
        const year = today.getFullYear().toString().slice(-2);
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const prefix = `INV${year}${month}`;
        
        const todayInvoices = invoices.filter(inv => 
          inv.invoiceNumber.startsWith(prefix)
        );
        
        const nextNum = (todayInvoices.length + 1).toString().padStart(4, '0');
        return `${prefix}${nextNum}`;
      },

      addInvoice: (invoiceData) => {
        const invoiceNumber = get().getNextInvoiceNumber();
        const newInvoice: Invoice = {
          ...invoiceData,
          id: Date.now().toString(),
          invoiceNumber,
          createdAt: new Date().toISOString(),
        };

        // Update stock for each item
        invoiceData.items.forEach((item) => {
          get().updateStock(item.productId, item.quantity, 'sale', invoiceNumber);
        });

        // Update customer purchase history
        if (invoiceData.customerId) {
          const customer = get().customers.find((c) => c.id === invoiceData.customerId);
          if (customer) {
            get().updateCustomer(invoiceData.customerId, {
              totalPurchases: customer.totalPurchases + invoiceData.totalAmount,
              lastPurchaseDate: new Date().toISOString(),
            });
          }
        }

        set((state) => ({ invoices: [newInvoice, ...state.invoices] }));
      },

      deleteInvoice: (id) => {
        set((state) => ({
          invoices: state.invoices.filter((inv) => inv.id !== id),
        }));
      },

      addStockMovement: (movement) => {
        set((state) => ({
          stockMovements: [movement, ...state.stockMovements],
        }));
      },
    }),
    {
      name: 'data-storage',
    }
  )
);
