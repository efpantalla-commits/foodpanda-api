import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('db-test')
  async testDatabase() {
    return await this.databaseService.query('SELECT 1 AS connected');
  }

  @Get('db-tables')
  async showTables() {
    return await this.databaseService.query('SHOW TABLES');
  }

  @Get('delete-test-user')
  async deleteTestUser() {
    return await this.databaseService.query(
      'DELETE FROM Users WHERE user_id = ? AND email = ?',
      [1, 'testuser101@example.com'],
    );
  }
}

