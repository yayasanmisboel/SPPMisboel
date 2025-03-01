import { useState } from 'react';
import { Banknote, Calendar, CircleCheck, CreditCard, FileText, School, Search } from 'lucide-react';

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
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert('Masukkan NISN atau nama siswa');
      return;
    }
    
    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate network request
    setTimeout(() => {
      // Retrieve data from localStorage
      const students: Student[] = JSON.parse(localStorage.getItem('students') || '[]');
      
      // Search by NISN or name
      const results = students.filter(student => 
        student.nisn.toLowerCase().includes(searchQuery.toLowerCase()) || 
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(results);
      setSelectedStudent(null);
      setIsSearching(false);
    }, 600);
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    
    // Get payments for this student
    const allPayments: Payment[] = JSON.parse(localStorage.getItem('payments') || '[]');
    const studentPayments = allPayments.filter(payment => payment.studentId === student.id);
    
    setPayments(studentPayments);
  };

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

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">Cek Pembayaran SPP</h1>
              <p className="text-emerald-100">Pantau status pembayaran SPP siswa dengan mudah dan cepat</p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/20 hidden md:block">
              <School size={48} />
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-emerald-300" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Masukkan NISN atau nama siswa"
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 text-white placeholder-emerald-200"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className={`absolute inset-y-2 right-2 px-6 py-2 ${
                isSearching ? 'bg-emerald-700 cursor-wait' : 'bg-white hover:bg-emerald-50'
              } text-emerald-700 rounded-lg font-medium transition-colors flex items-center`}
            >
              {isSearching ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-emerald-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mencari...
                </>
              ) : 'Cari'}
            </button>
          </div>
        </div>
      </div>
      
      {hasSearched && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all">
          {isSearching ? (
            <div className="flex items-center justify-center p-12">
              <svg className="animate-spin mr-3 h-8 w-8 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg text-gray-600">Mencari data pembayaran...</span>
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedStudent ? `Data SPP: ${selectedStudent.name}` : 'Hasil Pencarian'}
                </h2>
              </div>
              
              {!selectedStudent ? (
                <div className="p-6">
                  <p className="text-gray-500 mb-4">Ditemukan {searchResults.length} hasil pencarian untuk "{searchQuery}"</p>
                  <div className="space-y-3">
                    {searchResults.map(student => (
                      <div 
                        key={student.id}
                        className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 cursor-pointer transition-colors"
                        onClick={() => handleSelectStudent(student)}
                      >
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-semibold mr-4">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{student.name}</div>
                          <div className="text-sm text-gray-500">NISN: {student.nisn} • Kelas: {student.class}</div>
                        </div>
                        <div className="text-emerald-600">
                          <Search className="h-5 w-5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-semibold mr-3">
                        {selectedStudent.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{selectedStudent.name}</div>
                        <div className="text-sm text-gray-500">NISN: {selectedStudent.nisn} • Kelas: {selectedStudent.class}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedStudent(null)}
                      className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                    >
                      Kembali
                    </button>
                  </div>
                  
                  {payments.length > 0 ? (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center text-gray-500 mb-1 text-sm">
                            <CreditCard className="h-4 w-4 mr-1" />
                            <span>Total Tagihan</span>
                          </div>
                          <div className="text-xl font-bold text-gray-800">{stats.total} Bulan</div>
                        </div>
                        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                          <div className="flex items-center text-emerald-600 mb-1 text-sm">
                            <CircleCheck className="h-4 w-4 mr-1" />
                            <span>Sudah Dibayar</span>
                          </div>
                          <div className="text-xl font-bold text-emerald-600">{stats.paid} Bulan</div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                          <div className="flex items-center text-red-600 mb-1 text-sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Belum Dibayar</span>
                          </div>
                          <div className="text-xl font-bold text-red-600">{stats.unpaid} Bulan</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center text-blue-600 mb-1 text-sm">
                            <FileText className="h-4 w-4 mr-1" />
                            <span>Persentase</span>
                          </div>
                          <div className="text-xl font-bold text-blue-600">{stats.paidPercentage}% Lunas</div>
                        </div>
                      </div>
                      
                      <div className="px-6 pb-6">
                        <div className="overflow-hidden border border-gray-200 rounded-lg">
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
                                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                      <span className="font-medium text-gray-900">{payment.month}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.year}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center text-sm text-gray-900">
                                      <Banknote className="h-4 w-4 text-gray-400 mr-1" />
                                      Rp {payment.amount.toLocaleString()}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                                      payment.status === 'paid' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {payment.status === 'paid' ? (
                                        <>
                                          <CircleCheck className="h-3 w-3 mr-1" />
                                          Lunas
                                        </>
                                      ) : (
                                        <>Belum Lunas</>
                                      )}
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
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                      <FileText className="h-16 w-16 text-gray-300 mb-4" />
                      <p className="text-lg font-medium mb-1">Belum ada data pembayaran</p>
                      <p className="text-sm">Tidak ditemukan riwayat pembayaran untuk siswa ini</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-gray-500">
              <Search className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-lg font-medium mb-1">Tidak ditemukan hasil untuk "{searchQuery}"</p>
              <p className="text-sm">Pastikan NISN atau nama siswa dimasukkan dengan benar</p>
            </div>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 overflow-hidden">
          <div className="flex items-start mb-4">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Cek Status SPP</h3>
              <p className="text-gray-600 text-sm">
                Pantau status pembayaran SPP dengan mudah tanpa harus datang ke sekolah
              </p>
            </div>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80" 
            alt="Checking bills" 
            className="w-full h-48 object-cover rounded-lg" 
          />
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 overflow-hidden">
          <div className="flex items-start mb-4">
            <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600 mr-4">
              <CircleCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Akurat & Terpercaya</h3>
              <p className="text-gray-600 text-sm">
                Data pembayaran selalu diperbarui oleh bendahara sekolah secara real-time
              </p>
            </div>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80" 
            alt="Financial accuracy" 
            className="w-full h-48 object-cover rounded-lg" 
          />
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 overflow-hidden">
          <div className="flex items-start mb-4">
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
              <School className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Pendidikan Berkualitas</h3>
              <p className="text-gray-600 text-sm">
                Mendukung perkembangan pendidikan dengan pengelolaan administrasi yang efisien
              </p>
            </div>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80" 
            alt="Education" 
            className="w-full h-48 object-cover rounded-lg" 
          />
        </div>
      </div>
    </div>
  );
};

export default PublicCheckPayment;
