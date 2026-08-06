import { Response, NextFunction } from 'express';
import { UserRole } from '../entities/users.ts';
import { AuthRequest } from './auth.middleware.ts';

export function authorizeRoles(...allowedRoles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if(!req.user){
       return res.status(401).json({ message: 'Unauthorized: No user session found' })
    }

    if(!allowedRoles.includes(req.user.role)){
      return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource' })
    }

    next()
  }
}
