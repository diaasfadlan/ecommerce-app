import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black bg-opacity-50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">🏪</div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">Kusnaeni</h1>
              <p className="text-xs text-gray-400">Mart Premium</p>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-4">
            <button onClick={() => navigate('/products')} className="px-4 sm:px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-full font-bold text-sm sm:text-base transition-all hover:shadow-lg hover:shadow-orange-500/50 transform hover:scale-105">
              Shop
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8 lg:space-y-10">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-block px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-xs sm:text-sm font-bold">
                  🎯 Toko Premium Terpercaya
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight">
                  <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">Kusnaeni Mart</span>
                  <br />
                  <span className="text-white text-3xl sm:text-4xl lg:text-6xl">Kualitas Terbaik</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-lg">
                  Belanja produk pilihan berkualitas tinggi dengan harga yang sangat kompetitif.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button onClick={() => navigate('/products')} className="group relative px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg sm:rounded-xl font-bold text-sm sm:text-lg overflow-hidden transition-all hover:shadow-2xl hover:shadow-orange-500/50 transform hover:scale-105">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    🛍️ <span>Lihat Katalog</span> <span className="hidden sm:inline group-hover:translate-x-2 transition-transform">→</span>
                  </span>
                </button>
                
              </div>

              {/* Stats */}
              <div className="pt-4 sm:pt-8 grid grid-cols-3 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-orange-500 transition-colors">
                  <p className="text-2xl sm:text-3xl font-bold text-orange-400">100+</p>
                  <p className="text-xs sm:text-sm text-gray-400">Produk</p>
                </div>
                <div className="p-3 sm:p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-orange-500 transition-colors">
                  <p className="text-2xl sm:text-3xl font-bold text-red-400">5⭐</p>
                  <p className="text-xs sm:text-sm text-gray-400">Rating</p>
                </div>
                <div className="p-3 sm:p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-orange-500 transition-colors">
                  <p className="text-2xl sm:text-3xl font-bold text-pink-400">24/7</p>
                  <p className="text-xs sm:text-sm text-gray-400">Support</p>
                </div>
              </div>
            </div>

            {/* Right - Image Area (NO BORDER - Background shows) */}
            <div className="relative h-64 sm:h-80 lg:h-full min-h-64 sm:min-h-80 flex items-center justify-center mt-6 sm:mt-0">
              <img
                src={process.env.PUBLIC_URL + '/kusnaeni-hero.png'}
                alt="Kusnaeni Mart"
                className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-500 shadow-2xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="text-center"><p class="text-lg sm:text-xl text-gray-500">Gambar Hero Anda</p><p class="text-xs sm:text-sm text-gray-600 mt-2">Taruh: public/kusnaeni-hero.png</p></div>';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-center mb-8 sm:mb-16 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Kenapa Pilih Kami?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              { icon: '✨', title: 'Produk Premium', desc: 'Setiap item dipilih dengan standar kualitas tertinggi' },
              { icon: '💎', title: 'Harga Bersaing', desc: 'Dapatkan harga terbaik tanpa mengorbankan kualitas' },
              { icon: '⚡', title: 'Pelayanan Cepat', desc: 'Respon instan melalui WhatsApp 24/7' }
            ].map((feature, i) => (
              <div key={i} className={`group p-6 sm:p-8 bg-gradient-to-br ${feature.icon === '✨' ? 'from-orange-500' : feature.icon === '💎' ? 'from-red-500' : 'from-pink-500'} to-gray-900 rounded-xl sm:rounded-2xl border border-gray-700 hover:border-orange-500 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20`}>
                <div className="text-4xl sm:text-6xl mb-4 group-hover:scale-125 transition-transform">{feature.icon}</div>
                <h3 className="text-lg sm:text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">Siap Berbelanja?</h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-orange-100">Jelajahi ribuan produk berkualitas pilihan kami sekarang</p>
          <button onClick={() => navigate('/products')} className="px-8 sm:px-12 py-3 sm:py-5 bg-white text-orange-600 font-black text-base sm:text-lg rounded-full hover:bg-orange-50 transition-all transform hover:scale-105 hover:shadow-2xl inline-block">
            🛍️ Mulai Berbelanja
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 sm:py-8 px-4 sm:px-6 bg-black">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p className="mb-2 text-sm sm:text-base">© 2024 Kusnaeni Mart - Premium Quality Store</p>
          <p className="text-xs sm:text-sm">Kepuasan pelanggan adalah kesuksesan kami</p>
        </div>
      </footer>

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

export default HomePage;
