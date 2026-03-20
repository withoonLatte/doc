import React from 'react';
import { Document } from '../types';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface DocumentPrintProps {
  document: Document;
}

// Helper to convert number to Thai text (Baht)
function ArabicNumberToText(Number: number) {
  let NumberStr = Number.toFixed(2).toString();
  let NumberStrArr = NumberStr.split('.');
  let BahtText = '';
  let SatangText = '';

  const ThaiNumber = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const ThaiNumberScale = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

  if (NumberStrArr[0] !== '0') {
    let BahtArr = NumberStrArr[0].split('').reverse();
    for (let i = 0; i < BahtArr.length; i++) {
      if (i > 0 && i % 6 === 0) {
        BahtText = 'ล้าน' + BahtText;
      }
      if (BahtArr[i] !== '0') {
        let text = ThaiNumber[parseInt(BahtArr[i])];
        if (i % 6 === 1 && BahtArr[i] === '1') text = '';
        if (i % 6 === 1 && BahtArr[i] === '2') text = 'ยี่';
        if (i % 6 === 0 && BahtArr[i] === '1' && BahtArr.length > 1 && BahtArr[1] !== '0') text = 'เอ็ด';
        BahtText = text + ThaiNumberScale[i % 6] + BahtText;
      }
    }
    BahtText += 'บาท';
  }

  if (NumberStrArr[1] === '00') {
    SatangText = 'ถ้วน';
  } else {
    let SatangArr = NumberStrArr[1].split('').reverse();
    for (let i = 0; i < SatangArr.length; i++) {
      if (SatangArr[i] !== '0') {
        let text = ThaiNumber[parseInt(SatangArr[i])];
        if (i === 1 && SatangArr[i] === '1') text = '';
        if (i === 1 && SatangArr[i] === '2') text = 'ยี่';
        if (i === 0 && SatangArr[i] === '1' && SatangArr[1] !== '0') text = 'เอ็ด';
        SatangText = text + ThaiNumberScale[i] + SatangText;
      }
    }
    SatangText += 'สตางค์';
  }

  return BahtText + SatangText;
}

export default function DocumentPrint({ document: doc }: DocumentPrintProps) {
  const getDocTitle = () => {
    switch (doc.type) {
      case 'QUOTATION': return 'ใบเสนอราคา / Quotation';
      case 'INVOICE': return 'ใบแจ้งหนี้ / Invoice';
      case 'RECEIPT': return 'ใบเสร็จรับเงิน / Receipt';
      default: return 'เอกสาร';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: th });
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto text-slate-800 print:p-0 print:max-w-none" id="print-area">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-start gap-4">
          {doc.company.logo && (
            <img src={doc.company.logo} alt="Company Logo" className="h-20 object-contain" />
          )}
          <div>
            <h1 className="text-xl font-bold">{doc.company.name}</h1>
            <p className="text-sm mt-1 whitespace-pre-line">{doc.company.address}</p>
            <div className="text-sm mt-1 flex gap-4">
              {doc.company.taxId && <span>เลขประจำตัวผู้เสียภาษี: {doc.company.taxId}</span>}
              {doc.company.phone && <span>โทร: {doc.company.phone}</span>}
            </div>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-blue-600">{getDocTitle()}</h2>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <span className="font-semibold">เลขที่เอกสาร:</span>
            <span>{doc.docNumber}</span>
            <span className="font-semibold">วันที่:</span>
            <span>{formatDate(doc.date)}</span>
            {doc.dueDate && (
              <>
                <span className="font-semibold">ครบกำหนด:</span>
                <span>{formatDate(doc.dueDate)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <hr className="border-slate-200 mb-8" />

      {/* Customer Info */}
      <div className="mb-8">
        <h3 className="font-semibold mb-2">ลูกค้า / Customer:</h3>
        <div className="bg-slate-50 p-4 rounded-lg text-sm">
          <p className="font-bold text-base">{doc.customer.name}</p>
          <p className="mt-1 whitespace-pre-line">{doc.customer.address}</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {doc.customer.taxId && <p>เลขประจำตัวผู้เสียภาษี: {doc.customer.taxId}</p>}
            {doc.customer.phone && <p>โทร: {doc.customer.phone}</p>}
            {doc.customer.email && <p>อีเมล: {doc.customer.email}</p>}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-8 text-sm border-collapse">
        <thead>
          <tr className="bg-slate-100 border-y border-slate-300">
            <th className="py-2 px-4 text-left font-semibold w-12">ลำดับ</th>
            <th className="py-2 px-4 text-left font-semibold">รายการ</th>
            <th className="py-2 px-4 text-right font-semibold w-24">จำนวน</th>
            <th className="py-2 px-4 text-right font-semibold w-32">ราคา/หน่วย</th>
            <th className="py-2 px-4 text-right font-semibold w-32">จำนวนเงิน</th>
          </tr>
        </thead>
        <tbody>
          {doc.items.map((item, index) => (
            <tr key={item.id} className="border-b border-slate-200">
              <td className="py-3 px-4 text-center">{index + 1}</td>
              <td className="py-3 px-4">{item.description}</td>
              <td className="py-3 px-4 text-right">{item.quantity}</td>
              <td className="py-3 px-4 text-right">{item.unitPrice.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
              <td className="py-3 px-4 text-right">{item.total.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Area */}
      <div className="flex justify-between items-start mb-12">
        <div className="w-1/2 pr-8">
          {doc.notes && (
            <div>
              <h4 className="font-semibold text-sm mb-1">หมายเหตุ:</h4>
              <p className="text-sm whitespace-pre-line text-slate-600">{doc.notes}</p>
            </div>
          )}
          <div className="mt-8 bg-slate-50 p-3 rounded-lg text-center font-medium text-sm">
            ({ArabicNumberToText(doc.grandTotal)})
          </div>
        </div>
        <div className="w-1/2 max-w-xs">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1 text-slate-600">รวมเป็นเงิน</td>
                <td className="py-1 text-right font-medium">{doc.subtotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
              </tr>
              {doc.discount > 0 && (
                <tr>
                  <td className="py-1 text-slate-600">หักส่วนลด</td>
                  <td className="py-1 text-right font-medium">{doc.discount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                </tr>
              )}
              <tr>
                <td className="py-1 text-slate-600">มูลค่าหลังหักส่วนลด</td>
                <td className="py-1 text-right font-medium">{(doc.subtotal - doc.discount).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-600">ภาษีมูลค่าเพิ่ม {doc.taxRate}%</td>
                <td className="py-1 text-right font-medium">{doc.taxAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr className="border-t-2 border-slate-800">
                <td className="py-2 font-bold text-base">จำนวนเงินรวมทั้งสิ้น</td>
                <td className="py-2 text-right font-bold text-base">{doc.grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-16 mt-16 pt-8">
        <div className="text-center">
          <div className="border-b border-slate-400 w-48 mx-auto mb-2 h-8"></div>
          <p className="text-sm">ผู้รับของ / ผู้รับบริการ</p>
          <p className="text-sm mt-1">วันที่: _____/_____/_____</p>
        </div>
        <div className="text-center">
          <div className="border-b border-slate-400 w-48 mx-auto mb-2 h-8"></div>
          <p className="text-sm">ผู้ออกเอกสาร / ผู้รับเงิน</p>
          <p className="text-sm mt-1">วันที่: _____/_____/_____</p>
        </div>
      </div>
    </div>
  );
}
