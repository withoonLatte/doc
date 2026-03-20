export type DocType = 'QUOTATION' | 'INVOICE' | 'RECEIPT';

export type Role = 'admin' | 'staff';

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
}

export interface Customer {
  id: string;
  name: string;
  address?: string;
  taxId?: string;
  phone?: string;
  email?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  unit: string;
}

export interface DocItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CompanyInfo {
  name: string;
  address: string;
  taxId: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
}

export interface Document {
  id: string;
  type: DocType;
  docNumber: string;
  date: string;
  dueDate?: string;
  customer: Customer;
  items: DocItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  notes?: string;
  company: CompanyInfo;
}
