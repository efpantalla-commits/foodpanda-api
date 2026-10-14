
import { Injectable } from '@nestjs/common';
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
