interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'bendahara' | 'user';
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

const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    name: 'Administrator',
    role: 'admin'
  },
  {
    id: 2,
    username: 'bendahara',
    password: 'bendahara123',
    name: 'Bendahara Sekolah',
    role: 'bendahara'
  },
  {
    id: 3,
    username: 'user',
    password: 'user123',
    name: 'Orang Tua Murid',
    role: 'user'
  }
];

const mockStudents: Student[] = [
  {
    id: 1,
    nisn: '1001001',
    name: 'Ahmad Fauzi',
    class: '7A'
  },
  {
    id: 2,
    nisn: '1001002',
    name: 'Budi Santoso',
    class: '7A'
  },
  {
    id: 3,
    nisn: '1001003',
    name: 'Citra Dewi',
    class: '8B'
  },
  {
    id: 4,
    nisn: '1001004',
    name: 'Dian Permata',
    class: '9C'
  }
];

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const createMockPayments = (): Payment[] => {
  const currentYear = new Date().getFullYear();
  const payments: Payment[] = [];
  let id = 1;

  mockStudents.forEach(student => {
    // Create payments for current year
    months.forEach((month, idx) => {
      // First 6 months are paid, others are unpaid
      const isPaid = idx < 6;
      
      payments.push({
        id: id++,
        studentId: student.id,
        month,
        year: currentYear,
        amount: 150000, // Rp 150,000
        status: isPaid ? 'paid' : 'unpaid',
        date: isPaid ? `${currentYear}-${String(idx + 1).padStart(2, '0')}-15` : null
      });
    });
  });

  return payments;
};

export const initializeData = (): void => {
  // Initialize users if not exists
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(mockUsers));
  }

  // Initialize students if not exists
  if (!localStorage.getItem('students')) {
    localStorage.setItem('students', JSON.stringify(mockStudents));
  }

  // Initialize payments if not exists
  if (!localStorage.getItem('payments')) {
    const mockPayments = createMockPayments();
    localStorage.setItem('payments', JSON.stringify(mockPayments));
  }
};
