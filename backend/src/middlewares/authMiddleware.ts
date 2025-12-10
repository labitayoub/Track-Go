import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

interface ExtendRequest extends Request {
    user?: any;
}

export const authenticate = (req: ExtendRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "Accès non autorisé" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    console.log(decoded);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide" });
  }
};