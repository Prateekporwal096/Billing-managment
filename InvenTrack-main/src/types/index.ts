export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'manager';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  hsnCode: string;
  price: number;
  gstRate: number;
  stock: number;
  minStockLevel: number;
  supplierId?: string;
  supplierName?: string;
  description?: string;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  gstNumber?: string;
  state?: string;
  totalPurchases: number;
  lastPurchaseDate?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  customerGST?: string;
  items: InvoiceItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'other';
  status: 'paid' | 'pending' | 'cancelled';
  createdBy: string;
  createdAt: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  gstRate: number;
  total: number;
  hsnCode: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'sale' | 'purchase' | 'adjustment';
  quantity: number;
  balanceAfter: number;
  reference?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  todayRevenue: number;
  totalInvoices: number;
  todayInvoices: number;
  totalProducts: number;
  lowStockProducts: number;
  totalCustomers: number;
  totalGSTCollected: number;
}

export interface SalesReport {
  date: string;
  revenue: number;
  invoices: number;
  gstCollected: number;
}
