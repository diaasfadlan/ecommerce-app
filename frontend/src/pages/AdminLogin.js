import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) navigate('/admin/dashboard');
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        setError('Email atau password salah');
      } else if (error.code === 'auth/user-not-found') {
        setError('User tidak ditemukan');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Terlalu banyak percobaan. Coba lagi nanti');
      } else {
        setError(error.message || 'Login gagal');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 inline-block">🏪</div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Kusnaeni Mart
          </h1>
          <p className="text-gray-400 text-lg">Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 p-8 backdrop-blur-xl shadow-2xl hover:border-orange-500 transition-colors">
          <h2 className="text-2xl font-bold mb-2 text-white">Login Admin</h2>
          <p className="text-gray-400 mb-8">Masuk untuk mengelola produk toko</p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 bg-opacity-30 border-l-4 border-red-500 text-red-400 p-4 mb-6 rounded flex items-center gap-2">
              <span>✗</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-gray-300 font-semibold mb-3">📧 Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-white placeholder-gray-500"
                placeholder="admin@kusnaeni.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-300 font-semibold mb-3">🔐 Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-white placeholder-gray-500"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all transform hover:scale-105 text-lg"
            >
              {loading ? '⏳ Memproses...' : '✓ Login'}
            </button>
          </form>

          {/* Info */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-sm text-gray-500 text-center mb-4">
              Belum punya akun? Hubungi administrator untuk membuat akun baru
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full py-2 px-4 border-2 border-gray-600 hover:border-orange-400 text-gray-300 font-semibold rounded-lg transition-all hover:bg-gray-800"
            >
              ← Kembali ke Toko
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            © 2024 Kusnaeni Mart Admin Panel
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
