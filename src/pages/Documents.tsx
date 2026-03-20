import { useState } from 'react';
import { useStore } from '../store';
import { Plus, Search, FileText, Trash2, Printer, Edit2 } from 'lucide-react';
import { motion } from 'motion/react';
import DocumentForm from './DocumentForm';
import DocumentPrint from '../components/DocumentPrint';
import { Document } from '../types';

export function Documents() {
  const { documents, deleteDocument } = useStore();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  
  const [view, setView] = useState<'LIST' | 'FORM' | 'PRINT'>('LIST');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const filteredDocs = documents.filter(d => {
    const matchesSearch = d.docNumber.toLowerCase().includes(search.toLowerCase()) || d.customer.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'ALL' || d.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCreateNew = () => {
    setSelectedDoc(null);
    setView('FORM');
  };

  const handleEdit = (doc: Document) => {
    setSelectedDoc(doc);
    setView('FORM');
  };

  const handlePrint = (doc: Document) => {
    setSelectedDoc(doc);
    setView('PRINT');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  if (view === 'FORM') {
    return (
      <DocumentForm 
        initialData={selectedDoc || undefined} 
        onSave={() => setView('LIST')} 
        onCancel={() => setView('LIST')} 
      />
    );
  }

  if (view === 'PRINT' && selectedDoc) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center print:hidden mb-4 bg-white p-4 rounded-xl shadow-sm">
          <button 
            onClick={() => setView('LIST')}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            กลับไปหน้ารายการ
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-fuchsia-500 text-white rounded-xl hover:opacity-90 transition-opacity shadow-sm"
          >
            <Printer className="w-4 h-4" />
            พิมพ์เอกสาร
          </button>
        </div>
        <div className="bg-white shadow-sm rounded-xl overflow-hidden print:shadow-none print:rounded-none">
          <DocumentPrint document={selectedDoc} />
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 print:hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">เอกสารทั้งหมด</h2>
        <button 
          onClick={handleCreateNew}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-fuchsia-500 text-white rounded-xl hover:opacity-90 transition-opacity font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          สร้างเอกสารใหม่
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาเลขที่เอกสาร, ชื่อลูกค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        >
          <option value="ALL">ทุกประเภท</option>
          <option value="QUOTATION">ใบเสนอราคา</option>
          <option value="INVOICE">ใบแจ้งหนี้</option>
          <option value="RECEIPT">ใบเสร็จรับเงิน</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {filteredDocs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 flex flex-col items-center gap-2">
            <FileText className="w-12 h-12 text-slate-300" />
            <p>ไม่พบเอกสาร</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-sm font-medium text-slate-500">
                  <th className="p-4 font-medium">เลขที่เอกสาร</th>
                  <th className="p-4 font-medium">ลูกค้า</th>
                  <th className="p-4 font-medium">ประเภท</th>
                  <th className="p-4 font-medium">วันที่</th>
                  <th className="p-4 font-medium text-right">ยอดรวม</th>
                  <th className="p-4 font-medium text-center">สถานะ</th>
                  <th className="p-4 font-medium text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map(doc => (
                  <tr key={doc.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-slate-900">{doc.docNumber}</td>
                    <td className="p-4 text-sm text-slate-600">{doc.customer.name}</td>
                    <td className="p-4 text-sm text-slate-600">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                        doc.type === 'QUOTATION' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        doc.type === 'INVOICE' ? 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {doc.type === 'QUOTATION' ? 'ใบเสนอราคา' : doc.type === 'INVOICE' ? 'ใบแจ้งหนี้' : 'ใบเสร็จรับเงิน'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{new Date(doc.date).toLocaleDateString('th-TH')}</td>
                    <td className="p-4 text-sm font-medium text-slate-900 text-right">฿{doc.grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        doc.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                        doc.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {doc.status === 'PAID' ? 'ชำระแล้ว' : doc.status === 'PENDING' ? 'รอชำระ' : 'ยกเลิก'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button 
                        onClick={() => handlePrint(doc)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                        title="พิมพ์"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(doc)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                        title="แก้ไข"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบเอกสารนี้?')) {
                            deleteDocument(doc.id);
                          }
                        }} 
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                        title="ลบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
