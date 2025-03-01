import { useState, useEffect, useRef } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { ChartBar, CirclePlus, CreditCard, FileSpreadsheet, House, Printer, Settings, Trash2, UserPlus, Users } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import ExcelImport from '../components/ExcelImport';
import { generatePDF } from 'react-to-pdf';
import PrintablePaymentReport from '../components/PrintablePaymentReport';

interface User {
  id: number;
  username: string;
  role: string;
  name: string;
}

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

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  color: 'blue' | 'emerald' | 'amber' | 'rose';
}

const StatsCard = ({ title, value, description, icon, color }: StatsCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  const iconClasses = {
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600', 
    rose: 'bg-rose-100 text-rose-600'
  };

  return (
    <div className={`rounded-xl border p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        <div className={`p-2 rounded-lg ${iconClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      {description && <p className="text-xs opacity-80">{description}</p>}
    </div>
  );
};

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    // Load data
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const usersWithoutPasswords = allUsers.map((user: any) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    setUsers(usersWithoutPasswords);
    setStudents(JSON.parse(localStorage.getItem('students') || '[]'));
    setPayments(JSON.parse(localStorage.getItem('payments') || '[]'));
  }, []);

  // Calculate some stats
  const totalStudents = students.length;
  const totalPayments = payments.length;
  const paidPayments = payments.filter(p => p.status === 'paid').length;
  const paidPercentage = totalPayments ? Math.round((paidPayments / totalPayments) * 100) : 0;
  
  // Calculate total amount
  const totalAmount = payments.reduce((sum, payment) => {
    if (payment.status === 'paid') {
      return sum + payment.amount;
    }
    return sum;
  }, 0);

  // Get recent payments
  const recentPayments = [...payments]
    .filter(p => p.status === 'paid')
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 5);

  const getStudentName = (id: number) => {
    const student = students.find(s => s.id === id);
    return student ? student.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Selamat datang di panel admin SPP MISBAHUL ULUM</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <Printer size={16} className="mr-1" />
            Cetak Laporan
          </button>
          <button className="flex items-center px-3 py-1.5 text-sm bg-emerald-600 rounded-lg text-white hover:bg-emerald-700">
            <CirclePlus size={16} className="mr-1" />
            Tambah Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Siswa"
          value={totalStudents}
          description="Semua siswa terdaftar"
          icon={<Users size={18} />}
          color="blue"
        />
        <StatsCard
          title="Total Penerimaan"
          value={`Rp ${totalAmount.toLocaleString()}`}
          description="Total pembayaran diterima"
          icon={<CreditCard size={18} />}
          color="emerald"
        />
        <StatsCard
          title="Pembayaran"
          value={`${paidPayments}/${totalPayments}`}
          description={`${paidPercentage}% pembayaran lunas`}
          icon={<ChartBar size={18} />}
          color="amber"
        />
        <StatsCard
          title="Pengguna"
          value={users.length}
          description="Admin, bendahara, dan user"
          icon={<Users size={18} />}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white shadow rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Pembayaran Terbaru</h2>
          </div>
          <div className="p-6">
            {recentPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Siswa</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bulan/Tahun</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentPayments.map(payment => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {getStudentName(payment.studentId)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {payment.month} {payment.year}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          Rp {payment.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {payment.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Belum ada data pembayaran terbaru
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Ringkasan Pengguna</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {users.map(user => (
                <div key={user.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-semibold mr-4">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{user.name}</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <span className="capitalize">{user.role}</span>
                      <span className="mx-1">•</span>
                      <span>{user.username}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link 
              to="/admin/settings" 
              className="mt-4 block w-full py-2 px-4 text-center text-sm text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100"
            >
              Kelola Pengguna
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Student management component
const StudentManagement = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState({ nisn: '', name: '', class: '' });
  const [showImportForm, setShowImportForm] = useState(false);

  useEffect(() => {
    // Load students
    setStudents(JSON.parse(localStorage.getItem('students') || '[]'));
  }, []);

  const handleAddStudent = () => {
    if (!newStudent.nisn || !newStudent.name || !newStudent.class) {
      alert('Semua kolom harus diisi');
      return;
    }

    const allStudents = JSON.parse(localStorage.getItem('students') || '[]');
    const newId = allStudents.length > 0 ? Math.max(...allStudents.map((s: any) => s.id)) + 1 : 1;
    
    const studentToAdd = {
      id: newId,
      ...newStudent
    };
    
    const updatedStudents = [...allStudents, studentToAdd];
    localStorage.setItem('students', JSON.stringify(updatedStudents));
    
    setStudents(updatedStudents);
    
    // Reset form
    setNewStudent({ nisn: '', name: '', class: '' });
  };

  const handleDeleteStudent = (id: number) => {
    if (window.confirm('Yakin ingin menghapus siswa ini?')) {
      const allStudents = JSON.parse(localStorage.getItem('students') || '[]');
      const filteredStudents = allStudents.filter((student: any) => student.id !== id);
      localStorage.setItem('students', JSON.stringify(filteredStudents));
      
      setStudents(filteredStudents);
    }
  };

  const handleImportStudents = (importedData: any[]) => {
    if (importedData.length === 0) return;

    const allStudents = JSON.parse(localStorage.getItem('students') || '[]');
    let nextId = allStudents.length > 0 ? Math.max(...allStudents.map((s: any) => s.id)) + 1 : 1;
    
    const newStudents = importedData.map((student) => ({
      id: nextId++,
      nisn: student.nisn || '',
      name: student.name || '',
      class: student.class || ''
    }));
    
    const updatedStudents = [...allStudents, ...newStudents];
    localStorage.setItem('students', JSON.stringify(updatedStudents));
    setStudents(updatedStudents);
    
    setShowImportForm(false);
    alert(`Berhasil mengimpor ${newStudents.length} data siswa!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Siswa</h1>
          <p className="text-gray-500">Kelola data siswa Misbahul Ulum</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowImportForm(!showImportForm)}
            className="flex items-center px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <FileSpreadsheet size={16} className="mr-1" />
            {showImportForm ? 'Batal Import' : 'Import Excel'}
          </button>
          <button 
            onClick={() => {
              // Focus on add form
              document.getElementById('nisn-input')?.focus();
            }}
            className="flex items-center px-3 py-1.5 text-sm bg-emerald-600 rounded-lg text-white hover:bg-emerald-700"
          >
            <CirclePlus size={16} className="mr-1" />
            Tambah Siswa
          </button>
        </div>
      </div>

      {showImportForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium flex items-center">
              <FileSpreadsheet className="mr-2 h-5 w-5 text-emerald-600" />
              Import Data Siswa dari Excel
            </h3>
          </div>
          
          <ExcelImport 
            onImportData={handleImportStudents}
            headers={['nisn', 'name', 'class']}
            requiredFields={['nisn', 'name', 'class']}
            templateHeaders={{
              'nisn': 'NISN',
              'name': 'Nama Siswa',
              'class': 'Kelas'
            }}
          />
        </div>
      )}

      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-md font-medium flex items-center mb-3">
          <UserPlus className="mr-2 h-5 w-5 text-emerald-600" />
          Tambah Siswa Baru
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NISN</label>
            <input
              id="nisn-input"
              type="text"
              value={newStudent.nisn}
              onChange={(e) => setNewStudent({...newStudent, nisn: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input
              type="text"
              value={newStudent.name}
              onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
            <input
              type="text"
              value={newStudent.class}
              onChange={(e) => setNewStudent({...newStudent, class: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddStudent}
              className="flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <CirclePlus className="mr-2 h-5 w-5" />
              Tambah
            </button>
          </div>
        </div>
      </div>
              
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Daftar Siswa</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NISN</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map(student => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.nisn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.class}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <Link 
                        to={`/admin/students/${student.id}`}
                        className="text-emerald-600 hover:text-emerald-900"
                        title="Lihat Detail"
                      >
                        <Printer className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Hapus"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Belum ada data siswa
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Main AdminHome component
const AdminHome = () => {
  return (
    <div className="flex h-[calc(100vh-10rem)]">
      <div className="w-64 flex-shrink-0">
        <AdminSidebar />
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="transactions" element={<div>Halaman Transaksi</div>} />
          <Route path="reports" element={<div>Halaman Laporan</div>} />
          <Route path="settings" element={<div>Halaman Pengaturan</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminHome;
