import { useState } from 'react';
import { Search } from 'lucide-react';

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

const PublicCheckPayment = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert('Masukkan NISN atau nama siswa');
      return;
    }
    
    setHasSearched(true);
    
    // Retrieve data from localStorage
    const students: Student[] = JSON.parse(localStorage.getItem('students') || '[]');
    
    // Search by NISN or name
    const results = students.filter(student => 
      student.nisn.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(results);
    setSelectedStudent(null);
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    
    // Get payments for this student
    const allPayments: Payment[] = JSON.parse(localStorage.getItem('payments') || '[]');
    const studentPayments = allPayments.filter(payment => payment.studentId === student.id);
    
    setPayments(studentPayments);
  };

  return (
    <div className="space-y-6">
      <div className="bg-emerald-700 rounded-lg p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Cek Pembayaran SPP</h1>
        <p className="mb-4">Cek status pembayaran SPP tanpa perlu login.</p>
        
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Masukkan NISN atau nama siswa"
              className="w-full px-4 py-3 rounded-md border border-emerald-600 focus:outline-none focus:ring-2 focus:ring-white text-gray-800"
            />
            <Search className="absolute right-3 top-3 text-gray-400" size={20} />
          </div>
          <button
            onClick={handleSearch}
            className="bg-white text-emerald-700 px-6 py-3 rounded-md hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-700 transition-colors font-medium"
          >
            Cari
          </button>
        </div>
      </div>
      
      {hasSearched && (
        <div className="bg-white shadow rounded-lg p-6">
          {searchResults.length > 0 ? (
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">Hasil Pencarian</h2>
              
              {!selectedStudent ? (
                <div className="space-y-3">
                  {searchResults.map(student => (
                    <div 
                      key={student.id}
                      className="p-4 rounded-md bg-gray-50 border border-gray-200 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectStudent(student)}
                    >
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-500">NISN: {student.nisn} • Kelas: {student.class}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                      Data Pembayaran SPP: {selectedStudent.name}
                    </h3>
                    <button
                      onClick={() => setSelectedStudent(null)}
                      className="text-sm text-emerald-600 hover:text-emerald-800"
                    >
                      Kembali ke hasil pencarian
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Nama Siswa</div>
                        <div className="font-medium">{selectedStudent.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">NISN</div>
                        <div className="font-medium">{selectedStudent.nisn}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Kelas</div>
                        <div className="font-medium">{selectedStudent.class}</div>
                      </div>
                    </div>
                  </div>
                  
                  {payments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bulan</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Bayar</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {payments.map(payment => (
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
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Belum ada data pembayaran untuk siswa ini
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">Tidak ditemukan hasil untuk "{searchQuery}"</div>
              <p className="text-sm text-gray-500">
                Pastikan NISN atau nama siswa dimasukkan dengan benar
              </p>
            </div>
          )}
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-2">Tentang SPP Online</h2>
        <p className="text-gray-600 mb-4">
          Sistem SPP Online Misabahul Ulum memudahkan orang tua dan wali siswa dalam
          melakukan pengecekan status pembayaran SPP tanpa harus datang ke sekolah.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-emerald-50 rounded-lg">
            <h3 className="font-medium text-emerald-800 mb-1">Cek SPP Mudah</h3>
            <p className="text-sm text-gray-600">
              Cukup masukkan NISN atau nama siswa untuk melihat status pembayaran SPP.
            </p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg">
            <h3 className="font-medium text-emerald-800 mb-1">Informasi Akurat</h3>
            <p className="text-sm text-gray-600">
              Data pembayaran selalu diperbarui oleh bendahara sekolah.
            </p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg">
            <h3 className="font-medium text-emerald-800 mb-1">Hemat Waktu</h3>
            <p className="text-sm text-gray-600">
              Tidak perlu datang ke sekolah untuk mengecek status pembayaran SPP.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicCheckPayment;
