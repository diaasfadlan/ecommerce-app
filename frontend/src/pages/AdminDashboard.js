import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({name: '', description: '', price: '', category: '', stock: '', imageUrl: ''});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsLoggedIn(true);
        fetchProducts(user);
      } else {
        navigate('/admin');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchProducts = async (user) => {
    try {
      const token = await user.getIdToken();
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data.data || []);
    } catch (error) {
      setError('Gagal memuat produk');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran gambar maksimal 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToFirebase = async () => {
    if (!imageFile) return null;
    try {
      const timestamp = Date.now();
      const storageRef = ref(storage, `products/${timestamp}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      throw new Error('Gagal upload gambar');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      let imageUrl = formData.imageUrl;
      if (imageFile) imageUrl = await uploadImageToFirebase();
      const token = await auth.currentUser.getIdToken();
      const dataToSend = {...formData, imageUrl};
      
      if (editingId) {
        await axios.put(`http://localhost:5000/api/admin/products/${editingId}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Produk diperbarui!');
      } else {
        const response = await axios.post('http://localhost:5000/api/admin/products', dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts([...products, response.data.data]);
        setSuccess('Produk ditambahkan!');
      }
      setFormData({name: '', description: '', price: '', category: '', stock: '', imageUrl: ''});
      setImageFile(null);
      setImagePreview('');
      setShowForm(false);
      setEditingId(null);
      fetchProducts(auth.currentUser);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan produk');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      imageUrl: product.imageUrl,
    });
    setImagePreview(product.imageUrl);
    setEditingId(product.id);
    setShowForm(true);
    window.scrollTo(0, 300);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Yakin hapus produk ini?')) return;
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.delete(`http://localhost:5000/api/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(p => p.id !== productId));
      setSuccess('Produk dihapus!');
    } catch (err) {
      setError('Gagal hapus produk');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!isLoggedIn) return <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 w-full z-50 bg-black bg-opacity-50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Kusnaeni Mart</h1>
            <p className="text-xs sm:text-sm text-gray-400">Admin Dashboard</p>
          </div>
          <button onClick={handleLogout} className="px-4 sm:px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-sm sm:text-base transition-all">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
        {success && <div className="bg-green-900 bg-opacity-30 border-l-4 border-green-500 text-green-400 p-4 mb-6 rounded text-sm sm:text-base">✓ {success}</div>}
        {error && <div className="bg-red-900 bg-opacity-30 border-l-4 border-red-500 text-red-400 p-4 mb-6 rounded text-sm sm:text-base">✗ {error}</div>}

        <button onClick={() => {setShowForm(!showForm); if(showForm) {setEditingId(null); setFormData({name: '', description: '', price: '', category: '', stock: '', imageUrl: ''}); setImagePreview(''); setImageFile(null);}}} className="mb-8 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-lg font-bold text-sm sm:text-base transition-all transform hover:scale-105">
          {showForm ? '✕ Tutup' : '+ Tambah Produk'}
        </button>

        {showForm && (
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 p-6 sm:p-8 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              {editingId ? 'Edit Produk' : 'Tambah Produk'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Nama Produk" className="px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 outline-none transition-colors text-sm sm:text-base" />
                <input type="text" name="category" value={formData.category} onChange={handleInputChange} required placeholder="Kategori" className="px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 outline-none transition-colors text-sm sm:text-base" />
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required placeholder="Harga" className="px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 outline-none transition-colors text-sm sm:text-base" />
                <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required placeholder="Stok" className="px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 outline-none transition-colors text-sm sm:text-base" />
              </div>
              <textarea name="description" value={formData.description} onChange={handleInputChange} required placeholder="Deskripsi" rows="3" className="w-full px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-orange-500 outline-none transition-colors text-sm sm:text-base" />
              
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 sm:p-6">
                <label className="cursor-pointer">
                  <p className="mb-2 font-bold text-sm sm:text-base">📸 Upload Gambar</p>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-xs sm:text-sm cursor-pointer" />
                  <p className="text-xs text-gray-500 mt-2">Max 5MB</p>
                </label>
                {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 h-32 sm:h-40 w-32 sm:w-40 object-cover rounded-lg border border-orange-500" />}
              </div>

              <div className="flex gap-3 sm:gap-4 pt-4">
                <button type="submit" disabled={loading} className="flex-1 py-2 sm:py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold text-sm sm:text-base transition-all disabled:opacity-50">
                  {loading ? 'Proses...' : editingId ? 'Update' : 'Tambah'}
                </button>
                <button type="button" onClick={() => {setShowForm(false); setEditingId(null); setFormData({name: '', description: '', price: '', category: '', stock: '', imageUrl: ''}); setImagePreview(''); setImageFile(null);}} className="flex-1 py-2 sm:py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-bold text-sm sm:text-base transition-all">
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold">?? Produk ({products.length})</h2>
          </div>

          {products.length === 0 ? (
            <div className="p-8 sm:p-16 text-center">
              <p className="text-lg sm:text-2xl text-gray-400">Belum ada produk</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left font-bold text-gray-300">Gambar</th>
                    <th className="px-3 sm:px-6 py-3 text-left font-bold text-gray-300">Produk</th>
                    <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left font-bold text-gray-300">Kategori</th>
                    <th className="px-3 sm:px-6 py-3 text-right font-bold text-gray-300">Harga</th>
                    <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-center font-bold text-gray-300">Stok</th>
                    <th className="px-3 sm:px-6 py-3 text-center font-bold text-gray-300">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, i) => (
                    <tr key={product.id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors" style={{backgroundColor: i % 2 === 0 ? '#0a0a0a' : '#111111'}}>
                      <td className="px-3 sm:px-6 py-3">
                        <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-lg border border-gray-700" onError={e => e.target.src = 'https://via.placeholder.com/50'} />
                      </td>
                      <td className="px-3 sm:px-6 py-3 font-semibold text-white text-xs sm:text-base truncate">{product.name}</td>
                      <td className="hidden sm:table-cell px-3 sm:px-6 py-3"><span className="bg-orange-600 text-white px-2 py-1 rounded text-xs">{product.category}</span></td>
                      <td className="px-3 sm:px-6 py-3 text-right font-bold text-green-400 text-xs sm:text-base">Rp {product.price?.toLocaleString('id-ID')}</td>
                      <td className="hidden md:table-cell px-3 sm:px-6 py-3 text-center"><span className="px-2 py-1 rounded text-xs font-bold" style={{backgroundColor: product.stock > 0 ? '#065f46' : '#7f1d1d', color: product.stock > 0 ? '#10b981' : '#fca5a5'}}>{product.stock}</span></td>
                      <td className="px-3 sm:px-6 py-3">
                        <div className="flex gap-1 sm:gap-2 justify-center">
                          <button onClick={() => handleEdit(product)} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-1 px-2 sm:px-3 rounded text-xs sm:text-base transition-all">Edit</button>
                          <button onClick={() => handleDelete(product.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 sm:px-3 rounded text-xs sm:text-base transition-all">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-12 sm:mt-16 py-6 sm:py-8 px-4 sm:px-6 bg-black">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-xs sm:text-sm">
          <p className="mb-2">� 2024 Kusnaeni Mart Admin Dashboard</p>
          <p>Upload gambar produk langsung ke Firebase Storage</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
