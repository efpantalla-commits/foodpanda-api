
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    return await this.databaseService.query(
      'SELECT user_id, full_name, email, phone_number, role, created_at FROM Users',
    );
  }

  async create(
    full_name: string,
    email: string,
    password: string,
    phone_number: string,
    role: string,
  ) {
    const password_hash = await bcrypt.hash(password, 10);

    return await this.databaseService.query(
      'INSERT INTO Users (full_name, email, password_hash, phone_number, role) VALUES (?, ?, ?, ?, ?)',
      [full_name, email, password_hash, phone_number, role],
    );
  }

  async createAdmin(
    full_name: string,
    email: string,
    password: string,
    phone_number: string,
  ) {
    if (password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters.',
      );
    }

    const admins = await this.databaseService.query(
      "SELECT user_id FROM Users WHERE role = 'Admin'",
    );

    if (Array.isArray(admins) && admins.length > 0) {
      throw new ConflictException(
        'An Admin account has already been created.',
      );
    }

    const existing = await this.databaseService.query(
      'SELECT user_id FROM Users WHERE email = ?',
      [email],
    );

    if (Array.isArray(existing) && existing.length > 0) {
      throw new ConflictException('Email is already registered.');
    }

    const password_hash = await bcrypt.hash(password, 10);

    return await this.databaseService.query(
      `INSERT INTO Users
       (full_name, email, password_hash, phone_number, role)
       VALUES (?, ?, ?, ?, 'Admin')`,
      [full_name, email, password_hash, phone_number],
    );
  }

  async resetAdminPassword(email: string, password: string) {
    if (password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters.',
      );
    }

    const result: any = await this.databaseService.query(
      "SELECT user_id FROM Users WHERE email = ? AND role = 'Admin'",
      [email],
    );

    if (!result || result.length === 0) {
      throw new NotFoundException('Admin account not found.');
    }

    const password_hash = await bcrypt.hash(password, 10);

    await this.databaseService.query(
      'UPDATE Users SET password_hash = ? WHERE user_id = ?',
      [password_hash, result[0].user_id],
    );

    return { message: 'Admin password updated successfully.' };
  }

  async login(email: string, password: string) {
    const result: any = await this.databaseService.query(
      'SELECT user_id, full_name, email, password_hash, phone_number, role FROM Users WHERE email = ?',
      [email],
    );

    if (!result || result.length === 0) {
      return { message: 'Invalid email or password' };
    }

    const user = result[0];

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      return { message: 'Invalid email or password' };
    }

    const { password_hash, ...userWithoutPassword } = user;

    return {
      message: 'Login successful',
      user: userWithoutPassword,
    };
  }

  async update(
    user_id: number,
    full_name: string,
    email: string,
    phone_number: string,
    role: string,
  ) {
    return await this.databaseService.query(
      'UPDATE Users SET full_name = ?, email = ?, phone_number = ?, role = ? WHERE user_id = ?',
      [full_name, email, phone_number, role, user_id],
    );
  }

  async remove(user_id: number) {
    return await this.databaseService.query(
      'DELETE FROM Users WHERE user_id = ?',
      [user_id],
    );
  }
}
