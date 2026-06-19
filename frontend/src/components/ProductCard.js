import React from 'react';

const ProductCard = ({ product, onMessageClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
      <div className="relative pb-full pt-full">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Product'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-green-600">
            Rp {product.price?.toLocaleString('id-ID')}
          </span>
          <span className={`text-sm font-medium px-3 py-1 rounded ${
            product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {product.stock > 0 ? `Stok: ${product.stock}` : 'Habis'}
          </span>
        </div>
        <button
          onClick={() => onMessageClick(product)}
          disabled={product.stock === 0}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Pesan via WhatsApp
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
