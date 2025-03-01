import React, { forwardRef } from 'react';
import { School } from 'lucide-react';

interface Student {
  id: number;
  nisn: string;
  name: string;
  class: string;
}

interface Payment {
  id: number;
  studentId: number;
  month: string;
  year: number;
  amount: number;
  status: 'paid' | 'unpaid';
  date: string | null;
}

interface PrintablePaymentReportProps {
  student: Student | null;
  payments: Payment[];
  showHeader?: boolean;
}

const PrintablePaymentReport = forwardRef<HTMLDivElement, PrintablePaymentReportProps>(
  ({ student, payments, showHeader = true }, ref) => {
    if (!student) return null;
    
    // Calculate payment statistics
    const getPaymentStats = () => {
      if (!payments.length) return { total: 0, paid: 0, unpaid: 0, paidPercentage: 0 };
      
      const total = payments.length;
      const paid = payments.filter(p => p.status === 'paid').length;
      const unpaid = total - paid;
      const paidPercentage = Math.round((paid / total) * 100);
      
      return { total, paid, unpaid, paidPercentage };
    };
    
    const stats = getPaymentStats();
    const currentDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return (
      <div 
        ref={ref} 
        className="bg-white p-8 max-w-4xl mx-auto print:shadow-none"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {showHeader && (
          <div className="mb-6 border-b border-gray-300 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <School size={40} className="text-emerald-600 mr-3" />
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Yayasan Misabahul Ulum</h1>
                  <p className="text-sm text-gray-600">Kp.Cibolang, Banjarwangi, Ciawi, Bogor, Jawabarat 16720</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-semibold">LAPORAN PEMBAYARAN SPP</h2>
                <p className="text-sm text-gray-600">Tanggal Cetak: {currentDate}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Data Siswa</h3>
          <table className="w-full mb-4">
            <tbody>
              <tr>
                <td className="py-1 text-gray-600 w-1/4">Nama Siswa</td>
                <td className="py-1 font-medium">: {student.name}</td>
              </tr>
              <tr>
                <td className="py-1 text-gray-600">NISN</td>
                <td className="py-1">: {student.nisn}</td>
              </tr>
              <tr>
                <td className="py-1 text-gray-600">Kelas</td>
                <td className="py-1">: {student.class}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Ringkasan Pembayaran</h3>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="border rounded-md p-3 text-center">
              <p className="text-sm text-gray-600">Total Tagihan</p>
              <p className="text-xl font-bold">{stats.total} Bulan</p>
            </div>
            <div className="border rounded-md p-3 text-center bg-green-50">
              <p className="text-sm text-green-600">Sudah Dibayar</p>
              <p className="text-xl font-bold text-green-600">{stats.paid} Bulan</p>
            </div>
            <div className="border rounded-md p-3 text-center bg-red-50">
              <p className="text-sm text-red-600">Belum Dibayar</p>
              <p className="text-xl font-bold text-red-600">{stats.unpaid} Bulan</p>
            </div>
            <div className="border rounded-md p-3 text-center bg-blue-50">
              <p className="text-sm text-blue-600">Persentase</p>
              <p className="text-xl font-bold text-blue-600">{stats.paidPercentage}% Lunas</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Detail Pembayaran</h3>
          
          {payments.length > 0 ? (
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-sm font-medium">No</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Bulan</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Tahun</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Jumlah (Rp)</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Tanggal Bayar</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr key={payment.id} className="border-t border-gray-300">
                    <td className="px-4 py-2 text-sm">{index + 1}</td>
                    <td className="px-4 py-2 text-sm">{payment.month}</td>
                    <td className="px-4 py-2 text-sm">{payment.year}</td>
                    <td className="px-4 py-2 text-sm">Rp {payment.amount.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        payment.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {payment.status === 'paid' ? 'Lunas' : 'Belum Lunas'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">{payment.date || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-4 text-gray-500 border rounded-md">
              Belum ada data pembayaran untuk siswa ini
            </p>
          )}
        </div>
        
        <div className="mt-8 text-right">
          <p className="text-sm text-gray-600 mb-1">Bandung, {currentDate}</p>
          <p className="text-sm text-gray-600 mb-8">Bendahara Sekolah</p>
          <p className="text-sm font-medium">(.............................)</p>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-500 pt-6 border-t">
          <p>Dokumen ini dihasilkan secara otomatis oleh sistem SPP Hub</p>
          <p>Yayasan Misabahul Ulum - {new Date().getFullYear()}</p>
        </div>
      </div>
    );
  }
);

PrintablePaymentReport.displayName = 'PrintablePaymentReport';

export default PrintablePaymentReport;
