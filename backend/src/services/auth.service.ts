import prisma from '../prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'mini-erp-jwt-secret-key-2024',
      { expiresIn: '1d' }
    );

    const { passwordHash, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  static async register(name: string, email: string, password: string, role: string = 'SALES') {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Public registrations default to SALES for security
    const assignedRole = role === 'ADMIN' ? 'SALES' : (['SALES', 'WAREHOUSE', 'ACCOUNTS'].includes(role) ? role : 'SALES');

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: assignedRole,
      }
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'mini-erp-jwt-secret-key-2024',
      { expiresIn: '1d' }
    );

    const { passwordHash, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
