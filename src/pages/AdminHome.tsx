import { useState, useEffect, useRef } from 'react';
import { CirclePlus, FileSpreadsheet, Printer, Trash2, UserPlus } from 'lucide-react';
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

const AdminHome = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [activeTab, setActiveTab] = useState('users');
  const [newUser, setNewUser] = useState({ username: '', password: '', name: '', role: 'user' });
  const [newStudent, setNewStudent] = useState({ nisn: '', name: '', class: '' });
  const [showImportForm, setShowImportForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentPayments, setStudentPayments] = useState<Payment[]>([]);

  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load users without passwords
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const usersWithoutPasswords = allUsers.map((user: any) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    setUsers(usersWithoutPasswords);

    // Load students
    setStudents(JSON.parse(localStorage.getItem('students') || '[]'));
    
    // Load payments
    setPayments(JSON.parse(localStorage.getItem('payments') || '[]'));
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      const filteredPayments = payments.filter(
        payment => payment.studentId === selectedStudent.id
      );
      setStudentPayments(filteredPayments);
    } else {
      setStudentPayments([]);
    }
  }, [selectedStudent, payments]);

  const handleAddUser = () => {
    if (!newUser.username || !newUser.password || !newUser.name) {
      alert('Semua kolom harus diisi');
      return;
    }

    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const newId = allUsers.length > 0 ? Math.max(...allUsers.map((u: any) => u.id)) + 1 : 1;
    
    const userToAdd = {
      id: newId,
      ...newUser
    };
    
    const updatedUsers = [...allUsers, userToAdd];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Update the state with the user (without password)
    const { password, ...userWithoutPassword } = userToAdd;
    setUsers([...users, userWithoutPassword]);
    
    // Reset form
    setNewUser({ username: '', password: '', name: '', role: 'user' });
  };

  const handleDeleteUser = (id: number) => {
    if (window.confirm('Yakin ingin menghapus pengguna ini?')) {
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const filteredUsers = allUsers.filter((user: any) => user.id !== id);
      localStorage.setItem('users', JSON.stringify(filteredUsers));
      
      setUsers(users.filter(user => user.id !== id));
    }
  };

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
    
    setStudents([...students, studentToAdd]);
    
    // Reset form
    setNewStudent({ nisn: '', name: '', class: '' });
  };

  const handleDeleteStudent = (id: number) => {
    if (window.confirm('Yakin ingin menghapus siswa ini?')) {
      const allStudents = JSON.parse(localStorage.getItem('students') || '[]');
      const filteredStudents = allStudents.filter((student: any) => student.id !== id);
      localStorage.setItem('students', JSON.stringify(filteredStudents));
      
      setStudents(students.filter(student => student.id !== id));
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

  const handleViewStudentPayments = (student: Student) => {
    setSelectedStudent(student);
    setActiveTab('payments');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    if (!selectedStudent) return;
    
    try {
      const options = {
        filename: `laporan_spp_${selectedStudent.name.replace(/\s+/g, '_')}.pdf`,
        page: { margin: 20 }
      };
      
      await generatePDF(reportRef, options);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Terjadi kesalahan saat mengekspor PDF');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b">
          <nav className="flex">
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'users' ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-600 hover:text-gray-800'}`}
              onClick={() => setActiveTab('users')}
            >
              Manajemen Pengguna
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'students' ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-600 hover:text-gray-800'}`}
              onClick={() => {
                setActiveTab('students');
                setSelectedStudent(null);
              }}
            >
              Data Siswa
            </button>
            {selectedStudent && (
              <button
                className={`px-4 py-3 text-sm font-medium ${activeTab === 'payments' ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-500' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setActiveTab('payments')}
              >
                Pembayaran: {selectedStudent.name}
              </button>
            )}
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'users' && (
            <>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium flex items-center mb-3">
                  <UserPlus className="mr-2 h-5 w-5 text-emerald-600" />
                  Tambah Pengguna Baru
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="admin">Admin</option>
                      <option value="bendahara">Bendahara</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleAddUser}
                      className="flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                      <CirclePlus className="mr-2 h-5 w-5" />
                      Tambah
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          
          {activeTab === 'students' && (
            <>
              <div className="mb-6">
                {showImportForm ? (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <FileSpreadsheet className="mr-2 h-5 w-5 text-emerald-600" />
                        Import Data Siswa dari Excel
                      </h3>
                      <button 
                        onClick={() => setShowImportForm(false)}
                        className="text-sm text-gray-600 hover:text-gray-800"
                      >
                        Batal
                      </button>
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
                ) : (
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Data Siswa</h3>
                    <button
                      onClick={() => setShowImportForm(true)}
                      className="flex items-center px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none text-sm"
                    >
                      <FileSpreadsheet className="mr-1.5 h-4 w-4" />
                      Import Excel
                    </button>
                  </div>
                )}
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-md font-medium flex items-center mb-3">
                    <UserPlus className="mr-2 h-5 w-5 text-emerald-600" />
                    Tambah Siswa Baru
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">NISN</label>
                      <input
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
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.nisn}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.class}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleViewStudentPayments(student)}
                              className="text-emerald-600 hover:text-emerald-900"
                              title="Lihat Pembayaran"
                            >
                              <Printer className="h-5 w-5" />
                            </button>
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
                  </tbody>
                </table>
              </div>
            </>
          )}
          
          {activeTab === 'payments' && selectedStudent && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  Data Pembayaran: {selectedStudent.name}
                </h3>
                <div className="flex space-x-3">
                  <button
                    onClick={handlePrint}
                    className="flex items-center px-3 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none text-sm"
                  >
                    <Printer className="mr-1.5 h-4 w-4" />
                    Print
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none text-sm"
                  >
                    <FileSpreadsheet className="mr-1.5 h-4 w-4" />
                    Export PDF
                  </button>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg print:border-0 print:shadow-none overflow-hidden">
                <div className="p-4 print:hidden">
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
                        {studentPayments.map(payment => (
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
                        
                        {studentPayments.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                              Belum ada data pembayaran
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Printable version (hidden until print) */}
                <div className="hidden print:block">
                  <PrintablePaymentReport 
                    student={selectedStudent}
                    payments={studentPayments}
                  />
                </div>
              </div>
              
              {/* For PDF export - hidden from normal view */}
              <div className="hidden">
                <PrintablePaymentReport 
                  ref={reportRef}
                  student={selectedStudent}
                  payments={studentPayments}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
