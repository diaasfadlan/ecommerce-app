const { db, storage } = require('../config/firebase');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    console.log('📦 Fetching all products from Firestore...');
    const productsSnapshot = await db.collection('products').get();
    console.log(`✓ Found ${productsSnapshot.size} products`);
    
    const products = [];
    
    productsSnapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log('✅ Products fetched successfully');
    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('❌ Error getting products:', error.message || error);
    console.error('📋 Error details:', error);
    res.status(500).json({ 
      error: 'Failed to fetch products',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const productDoc = await db.collection('products').doc(id).get();

    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      data: {
        id: productDoc.id,
        ...productDoc.data(),
      },
    });
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Create product (admin only)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, imageUrl } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const productData = {
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock) || 0,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection('products').add(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        id: docRef.id,
        ...productData,
      },
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// Update product (admin only)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const productRef = db.collection('products').doc(id);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    updates.updatedAt = new Date();
    await productRef.update(updates);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        id,
        ...updates,
      },
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete product (admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const productRef = db.collection('products').doc(id);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await productRef.delete();

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
