import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Document, DocItem, Customer } from '../types';
import { Plus, Trash2, ArrowLeft, Save, FileText } from 'lucide-react';

interface DocumentFormProps {
  initialData?: Document;
  onSave: () => void;
  onCancel: () => void;
}

export default function DocumentForm({ initialData, onSave, onCancel }: DocumentFormProps) {
  const { customers, products, addDocument, updateDocument, companyInfo } = useStore();
  
  const [docType, setDocType] = useState<Document['type']>(initialData?.type || 'QUOTATION');
  const [docNumber, setDocNumber] = useState(initialData?.docNumber || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  
  const [selectedCustomerId, setSelectedCustomerId] = useState(initialData?.customer.id || '');
  const [customerDetails, setCustomerDetails] = useState<Customer | null>(initialData?.customer || null);
  
  const [items, setItems] = useState<DocItem[]>(initialData?.items || []);
  const [notes, setNotes] = useState(initialData?.notes || '');
  
  const [taxRate, setTaxRate] = useState(initialData?.taxRate || 7);
  const [discount, setDiscount] = useState(initialData?.discount || 0);

  // Generate Document Number if new
  useEffect(() => {
    if (!initialData) {
      const prefix = docType === 'QUOTATION' ? 'QT' : docType === 'INVOICE' ? 'INV' : 'RE';
      const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
      const randomStr = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setDocNumber(`${prefix}-${dateStr}-${randomStr}`);
    }
  }, [docType, initialData]);

  // Update customer details when selection changes
  useEffect(() => {
    if (selectedCustomerId) {
      const customer = customers.find(c => c.id === selectedCustomerId);
      if (customer) setCustomerDetails(customer);
    } else {
      setCustomerDetails(null);
    }
  }, [selectedCustomerId, customers]);

  const handleAddItem = () => {
    setItems([...items, { id: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof DocItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Auto-fill from product selection
        if (field === 'description') {
          const product = products.find(p => p.name === value);
          if (product) {
            updatedItem.unitPrice = product.price;
          }
        }
        updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        return updatedItem;
      }
      return item;
    }));
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const totalAfterDiscount = subtotal - discount;
  const taxAmount = (totalAfterDiscount * taxRate) / 100;
  const grandTotal = totalAfterDiscount + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerDetails) {
      alert('กรุณาเลือกลูกค้า');
      return;
    }
    if (items.length === 0) {
      alert('กรุณาเพิ่มรายการสินค้าอย่างน้อย 1 รายการ');
      return;
    }

    const docData: Document = {
      id: initialData?.id || crypto.randomUUID(),
      type: docType,
      docNumber,
      date,
      dueDate: dueDate || undefined,
      customer: customerDetails,
      items,
      subtotal,
      discount,
      taxRate,
      taxAmount,
      grandTotal,
      notes,
      status: initialData?.status || 'PENDING',
      company: companyInfo, // Snapshot of company info at time of creation
    };

    if (initialData) {
      updateDocument(initialData.id, docData);
    } else {
      addDocument(docData);
    }
    onSave();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800">
            {initialData ? 'แก้ไขเอกสาร' : 'สร้างเอกสารใหม่'}
          </h1>
        </div>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-fuchsia-500 text-white px-6 py-2 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
        >
          <Save className="w-5 h-5" />
          <span>บันทึกเอกสาร</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Document Details */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              ข้อมูลเอกสาร
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ประเภทเอกสาร</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as Document['type'])}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!!initialData}
                >
                  <option value="QUOTATION">ใบเสนอราคา (Quotation)</option>
                  <option value="INVOICE">ใบแจ้งหนี้ (Invoice)</option>
                  <option value="RECEIPT">ใบเสร็จรับเงิน (Receipt)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">เลขที่เอกสาร</label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">วันที่ออกเอกสาร</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">วันครบกำหนด (ถ้ามี)</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">รายการสินค้า/บริการ</h2>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4" /> เพิ่มรายการ
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-sm">
                    <th className="pb-2 font-medium w-1/2">รายละเอียด</th>
                    <th className="pb-2 font-medium text-right w-24">จำนวน</th>
                    <th className="pb-2 font-medium text-right w-32">ราคา/หน่วย</th>
                    <th className="pb-2 font-medium text-right w-32">รวม</th>
                    <th className="pb-2 font-medium w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="py-3 pr-2">
                        <input
                          type="text"
                          list="products-list"
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          placeholder="ชื่อสินค้า..."
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                        />
                      </td>
                      <td className="py-3 px-2 text-right font-medium text-slate-700">
                        {item.total.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 pl-2 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {items.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm">
                  ยังไม่มีรายการสินค้า คลิก "เพิ่มรายการ" เพื่อเริ่มต้น
                </div>
              )}
            </div>

            <datalist id="products-list">
              {products.map(p => (
                <option key={p.id} value={p.name} />
              ))}
            </datalist>

            {/* Totals */}
            <div className="mt-6 flex justify-end">
              <div className="w-full max-w-sm space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>รวมเป็นเงิน</span>
                  <span className="font-medium">{subtotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>ส่วนลด</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>ภาษีมูลค่าเพิ่ม (%)</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      className="w-16 px-2 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                    />
                  </div>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>จำนวนเงินภาษี</span>
                  <span>{taxAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-base">จำนวนเงินรวมทั้งสิ้น</span>
                  <span className="font-bold text-blue-600 text-lg">
                    ฿{grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notes */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">หมายเหตุ</h2>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เงื่อนไขการชำระเงิน, ข้อมูลบัญชีธนาคาร..."
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">ข้อมูลลูกค้า</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">เลือกลูกค้า</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- เลือกลูกค้า --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              
              {customerDetails && (
                <div className="p-4 bg-slate-50 rounded-xl text-sm space-y-2">
                  <p className="font-medium text-slate-800">{customerDetails.name}</p>
                  {customerDetails.address && <p className="text-slate-600">{customerDetails.address}</p>}
                  {customerDetails.taxId && <p className="text-slate-600">เลขผู้เสียภาษี: {customerDetails.taxId}</p>}
                  {customerDetails.phone && <p className="text-slate-600">โทร: {customerDetails.phone}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
