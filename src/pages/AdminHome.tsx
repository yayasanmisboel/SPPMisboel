import { useState, useEffect } from 'react';
import { CirclePlus, Trash2, UserPlus } from 'lucide-react';

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

const AdminHome = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [activeTab, setActiveTab] = useState('users');
  const [newUser, setNewUser] = useState({ username: '', password: '', name: '', role: 'user' });
  const [newStudent, setNewStudent] = useState({ nisn: '', name: '', class: '' });

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
  }, []);

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
              onClick={() => setActiveTab('students')}
            >
              Data Siswa
            </button>
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
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium flex items-center mb-3">
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
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
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
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
