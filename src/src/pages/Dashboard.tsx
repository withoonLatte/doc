import { useStore } from '../store';
import { FileText, Receipt, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function Dashboard({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const documents = useStore((state) => state.documents);
  
  const totalSales = documents.filter(d => d.type === 'RECEIPT').reduce((sum, d) => sum + d.grandTotal, 0);
  const receiptsCount = documents.filter(d => d.type === 'RECEIPT').length;
  const pendingAmount = documents.filter(d => d.type === 'INVOICE' && d.status === 'PENDING').reduce((sum, d) => sum + d.grandTotal, 0);
  const invoicesCount = documents.filter(d => d.type === 'INVOICE').length;

  const stats = [
    { title: 'รายได้รวม (ใบเสร็จ)', value: `฿${totalSales.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`, icon: Receipt, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50' },
    { title: 'จำนวนใบเสร็จ', value: `${receiptsCount} รายการ`, icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'รอรับชำระ (บิล)', value: `฿${pendingAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'จำนวนใบแจ้งหนี้', value: `${invoicesCount} รายการ`, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">ภาพรวมระบบ</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">เอกสารล่าสุด</h3>
          <button 
            onClick={() => setActiveTab('documents')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            ดูทั้งหมด
          </button>
        </div>
        {documents.length === 0 ? (
          <div className="text-center py-12 text-slate-500">ยังไม่มีเอกสารในระบบ</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-sm font-medium text-slate-500">
                  <th className="pb-3 font-medium">เลขที่เอกสาร</th>
                  <th className="pb-3 font-medium">ลูกค้า</th>
                  <th className="pb-3 font-medium">ประเภท</th>
                  <th className="pb-3 font-medium">วันที่</th>
                  <th className="pb-3 font-medium text-right">ยอดรวม</th>
                  <th className="pb-3 font-medium text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {documents.slice(-5).reverse().map(doc => (
                  <tr key={doc.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-sm font-medium text-slate-900">{doc.docNumber}</td>
                    <td className="py-4 text-sm text-slate-600">{doc.customer.name}</td>
                    <td className="py-4 text-sm text-slate-600">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                        doc.type === 'QUOTATION' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        doc.type === 'INVOICE' ? 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {doc.type === 'QUOTATION' ? 'ใบเสนอราคา' : doc.type === 'INVOICE' ? 'ใบแจ้งหนี้' : 'ใบเสร็จรับเงิน'}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-slate-600">{new Date(doc.date).toLocaleDateString('th-TH')}</td>
                    <td className="py-4 text-sm font-medium text-slate-900 text-right">฿{doc.grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                    <td className="py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        doc.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                        doc.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {doc.status === 'PAID' ? 'ชำระแล้ว' : doc.status === 'PENDING' ? 'รอชำระ' : 'ยกเลิก'}
                      </span>
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
