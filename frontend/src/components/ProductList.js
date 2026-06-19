import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

const ProductList = ({ onMessageClick }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Gagal memuat produk. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Memuat produk...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onMessageClick={onMessageClick}
        />
      ))}
    </div>
  );
};

export default ProductList;
