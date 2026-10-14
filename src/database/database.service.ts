
import { Injectable } from '@nestjs/common';
import mysql from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  private pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      ca: process.env.DB_SSL_CA,
      rejectUnauthorized: true,
    },
    waitForConnections: true,
    connectionLimit: 10,
  });

  async query(sql: string, params: any[] = []) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }
}