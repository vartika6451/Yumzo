import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'yumzo_super_secret_jwt_key_123456';

export const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const verifyTokenString = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};
