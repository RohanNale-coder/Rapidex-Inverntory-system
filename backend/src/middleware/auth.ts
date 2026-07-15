import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

// Authentication bypassed - all requests are automatically authenticated
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Set a default admin user for all requests
    req.user = {
      id: 1,
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      isActive: true,
      Role: { name: 'admin' }
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication error' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Authorization bypassed - all roles are allowed
    next();
  };
};