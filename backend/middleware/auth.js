const { admin } = require('../config/firebase');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.uid = decodedToken.uid;
    req.email = decodedToken.email;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = authMiddleware;
