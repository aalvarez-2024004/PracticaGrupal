import jwt from 'jsonwebtoken';

export const validateJWT = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  // Quita el 'Bearer ' de forma segura sin importar mayúsculas/minúsculas
  const token = authHeader.replace(/bearer\s+/i, '');

  try {
    // Verificamos la firma usando tu JWT_SECRET
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    
    // Inyectamos el uid en ambas estructuras para mantener compatibilidad con tu controlador
    req.uid = uid;
    req.user = { id: uid }; 

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};