import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Customer, Product, Document, CompanyInfo } from './types';

interface AppState {
  customers: Customer[];
  products: Product[];
  documents: Document[];
  companyInfo: CompanyInfo;
  addCustomer: (c: Customer) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addProduct: (p: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addDocument: (d: Document) => void;
  updateDocument: (id: string, data: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  updateCompanyInfo: (c: CompanyInfo) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      customers: [],
      products: [],
      documents: [],
      companyInfo: {
        name: 'บริษัท ตัวอย่าง จำกัด',
        address: '123 ถนนสุขุมวิท แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ 10110',
        taxId: '0105555555555',
        phone: '02-123-4567',
        email: 'contact@example.com',
      },
      addCustomer: (c) => set((state) => ({ customers: [...state.customers, c] })),
      updateCustomer: (id, data) => set((state) => ({ customers: state.customers.map((x) => (x.id === id ? { ...x, ...data } : x)) })),
      deleteCustomer: (id) => set((state) => ({ customers: state.customers.filter((x) => x.id !== id) })),
      addProduct: (p) => set((state) => ({ products: [...state.products, p] })),
      updateProduct: (id, data) => set((state) => ({ products: state.products.map((x) => (x.id === id ? { ...x, ...data } : x)) })),
      deleteProduct: (id) => set((state) => ({ products: state.products.filter((x) => x.id !== id) })),
      addDocument: (d) => set((state) => ({ documents: [...state.documents, d] })),
      updateDocument: (id, data) => set((state) => ({ documents: state.documents.map((x) => (x.id === id ? { ...x, ...data } : x)) })),
      deleteDocument: (id) => set((state) => ({ documents: state.documents.filter((x) => x.id !== id) })),
      updateCompanyInfo: (c) => set(() => ({ companyInfo: c })),
    }),
    { name: 'doc-system-storage' }
  )
);
