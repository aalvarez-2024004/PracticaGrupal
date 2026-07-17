import jwt from 'jsonwebtoken';

export const validateJWT = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // Solo verificamos que el token sea firmado correctamente
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    
    // Inyectamos el uid en el request
    req.uid = uid; 
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};