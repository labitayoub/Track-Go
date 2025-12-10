import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
    user?: { id: string; role: 'admin' | 'chauffeur' };
}

// Vérifier le token
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Token manquant" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string; role: 'admin' | 'chauffeur' };
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token invalide" });
    }
};

// Vérifier le rôle (admin ou chauffeur)
export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Accès interdit" });
        }
        next();
    };
};