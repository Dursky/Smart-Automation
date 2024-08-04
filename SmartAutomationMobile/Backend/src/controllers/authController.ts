import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import config from '../config';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email, phone } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    const user = new User({ username, password, email, phone });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);

    return res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });

    return res.json({
      token,
      user: {
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.json(userResponse);
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Failed to get user profile' });
  }
};
