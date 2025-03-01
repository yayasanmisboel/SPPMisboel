import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Banknote, ChartBar, Calendar, CreditCard, FileText, LayoutDashboard, School, Settings, Users } from 'lucide-react';

interface SidebarItem {
  title: string;
  icon: ReactNode;
  path: string;
  active: boolean;
}

interface SidebarSectionProps {
  title: string;
  items: SidebarItem[];
}

const SidebarSection = ({ title, items }: SidebarSectionProps) => (
  <div className="mb-6">
    <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
      {title}
    </h3>
    <div className="space-y-1">
      {items.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
            item.active
              ? 'bg-emerald-100 text-emerald-700'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <span className="mr-3 h-5 w-5">{item.icon}</span>
          {item.title}
        </Link>
      ))}
    </div>
  </div>
);

const AdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Define all main admin routes
  const routes = {
    dashboard: '/admin',
    students: '/admin/students',
    transactions: '/admin/transactions',
    reports: '/admin/reports',
    settings: '/admin/settings'
  };

  // App management items
  const managementItems: SidebarItem[] = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: routes.dashboard,
      active: currentPath === routes.dashboard
    },
    {
      title: 'Data Siswa',
      icon: <Users size={20} />,
      path: routes.students,
      active: currentPath === routes.students
    }
  ];
  
  // Financial items
  const financialItems: SidebarItem[] = [
    {
      title: 'Pembayaran',
      icon: <Banknote size={20} />,
      path: routes.transactions,
      active: currentPath === routes.transactions
    },
    {
      title: 'Laporan',
      icon: <ChartBar size={20} />,
      path: routes.reports,
      active: currentPath === routes.reports
    }
  ];
  
  // Settings items
  const configItems: SidebarItem[] = [
    {
      title: 'Pengaturan',
      icon: <Settings size={20} />,
      path: routes.settings,
      active: currentPath === routes.settings
    }
  ];

  return (
    <div className="h-full bg-white border-r">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 px-4 border-b">
          <div className="flex items-center space-x-2">
            <School className="h-6 w-6 text-emerald-600" />
            <span className="text-lg font-bold text-gray-800">Admin Panel</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-2">
          <SidebarSection title="Manajemen" items={managementItems} />
          <SidebarSection title="Keuangan" items={financialItems} />
          <SidebarSection title="Konfigurasi" items={configItems} />
        </div>
        
        <div className="p-4 border-t">
          <div className="bg-emerald-50 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-emerald-600 mr-2" />
              <h3 className="text-sm font-medium text-emerald-800">Tahun Ajaran</h3>
            </div>
            <p className="text-xs text-emerald-700 font-semibold">2023/2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
