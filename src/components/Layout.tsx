import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';

const Layout = () => {
  const [user, setUser] = useState<{ username: string, role: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('currentUser');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-['Inter',sans-serif]">
      <header className="bg-emerald-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-semibold">
            SPP Online Misabahul Ulum
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm">
                  Halo, <span className="font-medium">{user.username}</span> ({user.role})
                </span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-900 p-2 rounded text-sm"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-emerald-800 hover:bg-emerald-900 px-4 py-2 rounded text-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
      
      <footer className="bg-emerald-800 text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          &copy; {new Date().getFullYear()} Yayasan Misabahul Ulum. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
