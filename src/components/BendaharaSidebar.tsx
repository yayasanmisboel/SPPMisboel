import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Banknote, ChartBar, Calculator, CreditCard, FileText, LayoutDashboard, School, Users } from 'lucide-react';

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

const BendaharaSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Define all main bendahara routes
  const routes = {
    dashboard: '/bendahara',
    transactions: '/bendahara/transactions',
    payments: '/bendahara/payments',
    reports: '/bendahara/reports',
  };

  // Dashboard item
  const dashboardItems: SidebarItem[] = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: routes.dashboard,
      active: currentPath === routes.dashboard
    }
  ];
  
  // Financial items
  const financialItems: SidebarItem[] = [
    {
      title: 'Input Pembayaran',
      icon: <Banknote size={20} />,
      path: routes.transactions,
      active: currentPath === routes.transactions
    },
    {
      title: 'Riwayat Transaksi',
      icon: <CreditCard size={20} />,
      path: routes.payments,
      active: currentPath === routes.payments
    },
    {
      title: 'Laporan Keuangan',
      icon: <ChartBar size={20} />,
      path: routes.reports,
      active: currentPath === routes.reports
    }
  ];

  return (
    <div className="h-full bg-white border-r">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 px-4 border-b">
          <div className="flex items-center space-x-2">
            <Calculator className="h-6 w-6 text-emerald-600" />
            <span className="text-lg font-bold text-gray-800">Bendahara Panel</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-2">
          <SidebarSection title="Utama" items={dashboardItems} />
          <SidebarSection title="Keuangan" items={financialItems} />
        </div>
        
        <div className="p-4 border-t">
          <div className="bg-emerald-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-emerald-800">SPP Bulanan</h3>
              <span className="text-xs font-medium px-2 py-1 bg-emerald-200 text-emerald-800 rounded-full">Aktif</span>
            </div>
            <p className="text-xs text-emerald-700 font-semibold">Rp 150.000 / bulan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BendaharaSidebar;
