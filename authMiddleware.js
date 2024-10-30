const admin = require('firebase-admin');
const { auth } = admin;

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next(); // Permite continuar com a próxima função/middleware
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(403).json({ error: 'Unauthorized' });
  }
};

module.exports = { verifyToken };