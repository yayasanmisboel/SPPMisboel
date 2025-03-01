import { useState, useEffect } from 'react';
import { Check, CirclePlus, X } from 'lucide-react';

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

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const BendaharaHome = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [newPayment, setNewPayment] = useState({
    studentId: 0,
    month: months[0],
    year: new Date().getFullYear(),
    amount: 150000,
  });

  useEffect(() => {
    // Load students and payments from localStorage
    setStudents(JSON.parse(localStorage.getItem('students') || '[]'));
    setPayments(JSON.parse(localStorage.getItem('payments') || '[]'));
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      setFilteredPayments(payments.filter(payment => payment.studentId === selectedStudent));
    } else {
      setFilteredPayments([]);
    }
  }, [selectedStudent, payments]);

  const handleSelectStudent = (id: number) => {
    setSelectedStudent(id);
    setNewPayment({...newPayment, studentId: id});
  };

  const handleAddPayment = () => {
    if (!selectedStudent) {
      alert('Pilih siswa terlebih dahulu');
      return;
    }

    // Check if payment already exists
    const paymentExists = payments.some(p => 
      p.studentId === selectedStudent && 
      p.month === newPayment.month && 
      p.year === newPayment.year
    );

    if (paymentExists) {
      alert(`Pembayaran bulan ${newPayment.month} ${newPayment.year} sudah ada`);
      return;
    }

    const newId = payments.length > 0 ? Math.max(...payments.map(p => p.id)) + 1 : 1;
    
    const paymentToAdd = {
      id: newId,
      studentId: selectedStudent,
      month: newPayment.month,
      year: newPayment.year,
      amount: newPayment.amount,
      status: 'unpaid' as const,
      date: null
    };
    
    const updatedPayments = [...payments, paymentToAdd];
    localStorage.setItem('payments', JSON.stringify(updatedPayments));
    setPayments(updatedPayments);
  };

  const handleUpdatePaymentStatus = (id: number, newStatus: 'paid' | 'unpaid') => {
    const updatedPayments = payments.map(payment => {
      if (payment.id === id) {
        return {
          ...payment,
          status: newStatus,
          date: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : null
        };
      }
      return payment;
    });
    
    localStorage.setItem('payments', JSON.stringify(updatedPayments));
    setPayments(updatedPayments);
  };

  const getStudentName = (id: number) => {
    const student = students.find(s => s.id === id);
    return student ? student.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Manajemen SPP</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Pilih Siswa</h2>
        
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NISN</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map(student => (
                <tr 
                  key={student.id} 
                  className={`${selectedStudent === student.id ? 'bg-emerald-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.nisn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.class}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleSelectStudent(student.id)}
                      className={`px-3 py-1 rounded-md ${
                        selectedStudent === student.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {selectedStudent === student.id ? 'Selected' : 'Select'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {selectedStudent && (
          <>
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Data Pembayaran: {getStudentName(selectedStudent)}
              </h2>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-md font-medium flex items-center mb-3">
                  <CirclePlus className="mr-2 h-5 w-5 text-emerald-600" />
                  Tambah Data Pembayaran
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                    <select
                      value={newPayment.month}
                      onChange={(e) => setNewPayment({...newPayment, month: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                    <input
                      type="number"
                      value={newPayment.year}
                      onChange={(e) => setNewPayment({...newPayment, year: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah (Rp)</label>
                    <input
                      type="number"
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment({...newPayment, amount: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleAddPayment}
                      className="flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                      <CirclePlus className="mr-2 h-5 w-5" />
                      Tambah
                    </button>
                  </div>
                </div>
              </div>
              
              {filteredPayments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bulan</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Bayar</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPayments.map(payment => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.month}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.year}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {payment.amount.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {payment.status === 'paid' ? 'Lunas' : 'Belum Lunas'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.date || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {payment.status === 'unpaid' ? (
                              <button
                                onClick={() => handleUpdatePaymentStatus(payment.id, 'paid')}
                                className="text-green-600 hover:text-green-900 mr-3"
                                title="Mark as Paid"
                              >
                                <Check className="h-5 w-5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdatePaymentStatus(payment.id, 'unpaid')}
                                className="text-red-600 hover:text-red-900 mr-3"
                                title="Mark as Unpaid"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Belum ada data pembayaran
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BendaharaHome;
