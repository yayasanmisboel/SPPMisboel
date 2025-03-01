import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CircleAlert, LogIn, School } from 'lucide-react';

type FormData = {
  username: string;
  password: string;
};

const Login = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    setIsLoading(true);
    setError('');
    
    // Simulate network request
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => 
        u.username === data.username && u.password === data.password
      );

      if (user) {
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        
        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'bendahara') {
          navigate('/bendahara');
        } else {
          navigate('/user');
        }
      } else {
        setError('Username atau password salah');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
          <School size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Login ke SPP Hub</h1>
        <p className="text-gray-500 mt-2">Masukkan kredensial Anda untuk akses sistem</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
            <CircleAlert className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                autoComplete="username"
                {...register('username', { required: "Username harus diisi" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Masukkan username Anda"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password', { required: "Password harus diisi" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Masukkan password Anda"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-emerald-700'
            } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors`}
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <LogIn className="mr-2 h-5 w-5" />
            )}
            {isLoading ? 'Processing...' : 'Login'}
          </button>
        </form>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Ingin mengecek pembayaran SPP tanpa login?{' '}
          <a href="/" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
            Klik di sini
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
