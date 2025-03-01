import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LogOut, Menu, School, X } from 'lucide-react';

const Layout = () => {
  const [user, setUser] = useState<{ username: string, role: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userInfo = localStorage.getItem('currentUser');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = (e: React.MouseEvent) => {
    // Prevent event from propagating to parent elements
    e.stopPropagation();
    e.preventDefault();
    
    localStorage.removeItem('currentUser');
    setUser(null);
    navigate('/');
  };

  const toggleMobileMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-['Inter',sans-serif]">
      <header className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
              <School size={30} className="text-white" />
              <div>
                <div className="leading-tight">SPP MISBAHUL ULUM</div>
                <div className="text-xs font-normal opacity-80">Sistem Pembayaran Pendidikan</div>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {user ? (
                <>
                  <div className="flex items-center bg-emerald-700/40 px-4 py-1.5 rounded-full border border-emerald-500/30">
                    <div className="w-7 h-7 rounded-full bg-white text-emerald-700 flex items-center justify-center font-semibold mr-2">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{user.username}</div>
                      <div className="text-xs opacity-75 capitalize">{user.role}</div>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 transition-colors px-4 py-2 rounded-md text-sm font-medium"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="bg-white text-emerald-700 hover:bg-emerald-50 transition-colors px-6 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-white"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-4 pb-2 border-t border-emerald-600/50 mt-4" onClick={(e) => e.stopPropagation()}>
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center bg-emerald-700/40 p-3 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-white text-emerald-700 flex items-center justify-center font-semibold mr-3 text-lg">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm opacity-75 capitalize">{user.role}</div>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 transition-colors p-3 rounded-md font-medium"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="block w-full bg-white text-emerald-700 hover:bg-emerald-50 transition-colors p-3 rounded-md font-medium text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <School size={24} className="mr-2" />
              <span className="font-bold text-lg">Yayasan Misbahul Ulum</span>
            </div>
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Yayasan Misbahul Ulum. All rights reserved.
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700 text-sm text-gray-400 flex flex-col md:flex-row justify-between">
            <div className="mb-2 md:mb-0">Kp.Cibolang, Banjarwangi, Ciawi, Bogor, Jawabarat 16720</div>
            <div>Email: info@misbahululum.sch.id | Telp: (022) 123-4567</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
