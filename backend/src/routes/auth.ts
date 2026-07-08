import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, companyId } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      companyId: companyId || 1
    });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRE as string } as any
    );

    res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRE as string } as any
    );

    res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get Profile
router.get('/profile', authenticate, async (req: any, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;