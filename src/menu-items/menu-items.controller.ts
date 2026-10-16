
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  async findAll() {
    return await this.databaseService.query(
      'SELECT * FROM MenuItems',
    );
  }

  @Post()
  async create(
    @Body()
    body: {
      restaurant_id: number;
      category_id: number;
      item_name: string;
      description: string;
      price: number;
      is_available: number;
    },
  ) {
    return await this.databaseService.query(
      'INSERT INTO MenuItems (restaurant_id, category_id, item_name, description, price, is_available) VALUES (?, ?, ?, ?, ?, ?)',
      [
        body.restaurant_id,
        body.category_id,
        body.item_name,
        body.description,
        body.price,
        body.is_available,
      ],
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      restaurant_id: number;
      category_id: number;
      item_name: string;
      description: string;
      price: number;
      is_available: number;
    },
  ) {
    return await this.databaseService.query(
      'UPDATE MenuItems SET restaurant_id = ?, category_id = ?, item_name = ?, description = ?, price = ?, is_available = ? WHERE item_id = ?',
      [
        body.restaurant_id,
        body.category_id,
        body.item_name,
        body.description,
        body.price,
        body.is_available,
        Number(id),
      ],
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.databaseService.query(
      'DELETE FROM MenuItems WHERE item_id = ?',
      [Number(id)],
    );
  }
}
