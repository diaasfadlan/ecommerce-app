import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsLoggedIn(true);
        fetchProducts(user);
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setProducts([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const fetchProducts = async (user) => {
    try {
      const token = await user.getIdToken();
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.post(
        'http://localhost:5000/api/admin/products',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProducts([...products, response.data.data]);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        imageUrl: '',
      });
      setShowForm(false);
      setSuccess('Produk berhasil ditambahkan!');
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal menambahkan produk');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;

    try {
      const token = await auth.currentUser.getIdToken();
      await axios.delete(`http://localhost:5000/api/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(products.filter(p => p.id !== productId));
      setSuccess('Produk berhasil dihapus!');
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal menghapus produk');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Admin Login</h1>
          <p className="text-gray-600 text-center mb-8">Masuk untuk mengelola produk</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Memproses...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Messages */}
        {success && (
          <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
            {success}
          </div>
        )}
        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
            {error}
          </div>
        )}

        {/* Add Product Button */}
        <div className='mb-6'>
          <button
            onClick={() => setShowForm(!showForm)}
            className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg'
          >
            {showForm ? 'Batal' : 'Tambah Produk Baru'}
          </button>
        </div>

        {/* Add Product Form */}
        {showForm && (
          <div className='bg-white rounded-lg shadow-lg p-6 mb-8'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>Tambah Produk Baru</h2>
            <form onSubmit={handleAddProduct} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-gray-700 font-semibold mb-2'>Nama Produk</label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                    placeholder='Nama produk'
                  />
                </div>

                <div>
                  <label className='block text-gray-700 font-semibold mb-2'>Kategori</label>
                  <input
                    type='text'
                    name='category'
                    value={formData.category}
                    onChange={handleInputChange}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                    placeholder='Kategori'
                  />
                </div>

                <div>
                  <label className='block text-gray-700 font-semibold mb-2'>Harga (Rp)</label>
                  <input
                    type='number'
                    name='price'
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                    placeholder='0'
                  />
                </div>

                <div>
                  <label className='block text-gray-700 font-semibold mb-2'>Stok</label>
                  <input
                    type='number'
                    name='stock'
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                    placeholder='0'
                  />
                </div>
              </div>

              <div>
                <label className='block text-gray-700 font-semibold mb-2'>Deskripsi</label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                  placeholder='Deskripsi produk'
                  rows='4'
                />
              </div>

              <div>
                <label className='block text-gray-700 font-semibold mb-2'>URL Gambar</label>
                <input
                  type='url'
                  name='imageUrl'
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                  placeholder='https://example.com/image.jpg'
                />
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors'
              >
                {loading ? 'Memproses...' : 'Tambah Produk'}
              </button>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
          <h2 className='text-2xl font-bold text-gray-800 p-6 border-b'>Daftar Produk</h2>
          {products.length === 0 ? (
            <p className='p-6 text-gray-500 text-center'>Belum ada produk</p>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-200'>
                  <tr>
                    <th className='px-6 py-3 text-left font-semibold text-gray-700'>Nama</th>
                    <th className='px-6 py-3 text-left font-semibold text-gray-700'>Kategori</th>
                    <th className='px-6 py-3 text-left font-semibold text-gray-700'>Harga</th>
                    <th className='px-6 py-3 text-left font-semibold text-gray-700'>Stok</th>
                    <th className='px-6 py-3 text-left font-semibold text-gray-700'>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className='border-t hover:bg-gray-50'>
                      <td className='px-6 py-4'>{product.name}</td>
                      <td className='px-6 py-4'>{product.category}</td>
                      <td className='px-6 py-4'>Rp {product.price?.toLocaleString('id-ID')}</td>
                      <td className='px-6 py-4'>{product.stock}</td>
                      <td className='px-6 py-4'>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className='bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded'
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
