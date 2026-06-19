const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// Admin routes (protected)
router.use(authMiddleware);

router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;
