
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  async findAll() {
    return await this.databaseService.query(
      'SELECT * FROM Categories',
    );
  }

  @Post()
  async create(
    @Body()
    body: {
      restaurant_id: number;
      category_name: string;
    },
  ) {
    return await this.databaseService.query(
      'INSERT INTO Categories (restaurant_id, category_name) VALUES (?, ?)',
      [body.restaurant_id, body.category_name],
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      restaurant_id: number;
      category_name: string;
    },
  ) {
    return await this.databaseService.query(
      'UPDATE Categories SET restaurant_id = ?, category_name = ? WHERE category_id = ?',
      [body.restaurant_id, body.category_name, Number(id)],
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.databaseService.query(
      'DELETE FROM Categories WHERE category_id = ?',
      [Number(id)],
    );
  }
}
