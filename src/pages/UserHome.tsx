import { useState, useEffect } from 'react';

interface Payment {
  id: number;
  studentId: number;
  month: string;
  year: number;
  amount: number;
  status: 'paid' | 'unpaid';
  date: string | null;
}

interface Student {
  id: number;
  nisn: string;
  name: string;
  class: string;
}

const UserHome = () => {
  const [user, setUser] = useState<{ username: string, name: string } | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const userInfo = localStorage.getItem('currentUser');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }

    // Load students and payments
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
  };

  const getPaymentSummary = () => {
    if (!filteredPayments.length) return { total: 0, paid: 0, unpaid: 0 };
    
    const total = filteredPayments.length;
    const paid = filteredPayments.filter(p => p.status === 'paid').length;
    const unpaid = total - paid;
    
    return { total, paid, unpaid };
  };

  const summary = getPaymentSummary();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Selamat datang, {user?.name || 'User'}
      </h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Lihat Status Pembayaran SPP</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-md font-medium mb-3">Pilih Siswa</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-3">
                {students.map(student => (
                  <div 
                    key={student.id}
                    className={`p-3 rounded-md cursor-pointer ${
                      selectedStudent === student.id 
                        ? 'bg-emerald-100 border border-emerald-300' 
                        : 'bg-white border border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => handleSelectStudent(student.id)}
                  >
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-gray-500">NISN: {student.nisn} • Kelas: {student.class}</div>
                  </div>
                ))}
                
                {students.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    Tidak ada data siswa
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {selectedStudent && (
            <div>
              <h3 className="text-md font-medium mb-3">Ringkasan Pembayaran</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-3 rounded-md border border-gray-200 text-center">
                    <div className="text-gray-500 text-sm">Total</div>
                    <div className="text-xl font-bold">{summary.total}</div>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-gray-200 text-center">
                    <div className="text-gray-500 text-sm">Lunas</div>
                    <div className="text-xl font-bold text-green-600">{summary.paid}</div>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-gray-200 text-center">
                    <div className="text-gray-500 text-sm">Belum Lunas</div>
                    <div className="text-xl font-bold text-red-600">{summary.unpaid}</div>
                  </div>
                </div>
                
                {filteredPayments.length > 0 ? (
                  <div className="overflow-hidden rounded-md border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Bulan</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tahun</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPayments.map(payment => (
                          <tr key={payment.id}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">{payment.month}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">{payment.year}</td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {payment.status === 'paid' ? 'Lunas' : 'Belum Lunas'}
                              </span>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHome;
