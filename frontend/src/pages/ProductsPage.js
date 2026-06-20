import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.get(`${backendUrl}/api/products`);
      setProducts(response.data.data);
      setError(null);
    } catch (err) {
      setError('Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = (product) => {
    const phone = process.env.REACT_APP_WHATSAPP_NUMBER || '6289699205601';
    const msg = `Halo! Saya tertarik dengan:\n\n*${product.name}*\n💰 Rp ${product.price?.toLocaleString('id-ID')}\n\nApakah masih tersedia?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const filteredProducts = filter ? products.filter(p => p.category?.toLowerCase().includes(filter.toLowerCase())) : products;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black bg-opacity-50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
            <div className="text-3xl group-hover:scale-110 transition-transform">🏪</div>
            <span className="font-black text-xl">Kusnaeni Mart</span>
          </button>
          <button onClick={() => navigate('/')} className="px-6 py-2 border border-gray-600 hover:border-orange-500 rounded-full transition-all hover:bg-orange-500 hover:bg-opacity-10">
            ← Kembali
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Koleksi Produk</span>
          </h1>
          <p className="text-xl text-gray-400">Pilih produk favorit Anda dan hubungi kami melalui WhatsApp</p>
        </div>

        {/* Filter */}
        {products.length > 0 && (
          <div className="mb-8 flex gap-3 flex-wrap">
            <button
              onClick={() => setFilter('')}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                !filter ? 'bg-orange-500 text-white' : 'border border-gray-600 hover:border-orange-500'
              }`}
            >
              Semua
            </button>
            {[...new Set(products.map(p => p.category))].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full font-bold transition-all ${
                  filter === cat ? 'bg-orange-500 text-white' : 'border border-gray-600 hover:border-orange-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-5xl mb-4">⏳</div>
            <p className="text-gray-400 text-lg">Memuat produk...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-900 bg-opacity-30 border-l-4 border-red-500 text-red-400 p-4 mb-8 rounded">
            ⚠️ {error}
          </div>
        )}

        {/* Empty */}
        {!loading && products.length === 0 && !error && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">📦</p>
            <p className="text-2xl text-gray-400">Belum ada produk tersedia</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <div key={product.id} className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 hover:border-orange-500 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20">
                {/* Image */}
                <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                  <img
                    src={product.imageUrl || 'https://via.placeholder.com/400x300?text=Product'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <span className="text-3xl font-black text-red-500">HABIS</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-full text-sm font-bold">
                    {product.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold line-clamp-2 group-hover:text-orange-400 transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-gray-400 line-clamp-3 text-sm">
                    {product.description}
                  </p>

                  {/* Price & Stock */}
                  <div className="pt-4 border-t border-gray-800 space-y-3">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Harga</p>
                        <p className="text-3xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                          Rp {product.price?.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">Stok</p>
                        <p className={`text-2xl font-bold ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {product.stock > 0 ? `${product.stock}x` : '0'}
                        </p>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleWhatsApp(product)}
                      disabled={product.stock === 0}
                      className={`w-full py-3 rounded-lg font-bold transition-all transform hover:scale-105 text-lg ${
                        product.stock > 0
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/50'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {product.stock > 0 ? '💬 Pesan via WhatsApp' : 'Stok Habis'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Filter Results */}
        {!loading && filter && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-400">Tidak ada produk di kategori "{filter}"</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20 py-8 px-6 bg-black">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p className="mb-2">© 2024 Kusnaeni Mart - Premium Quality Store</p>
          <p className="text-sm">Hubungi kami di WhatsApp untuk informasi lebih lanjut</p>
        </div>
      </footer>
    </div>
  );
};

export default ProductsPage;
