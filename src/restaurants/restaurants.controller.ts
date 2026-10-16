
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  async findAll() {
    return await this.databaseService.query(
      'SELECT * FROM Restaurants',
    );
  }

  @Post()
  async create(
    @Body()
    body: {
      owner_id: number;
      restaurant_name: string;
      cuisine_type: string;
      address: string;
    },
  ) {
    return await this.databaseService.query(
      'INSERT INTO Restaurants (owner_id, restaurant_name, cuisine_type, address) VALUES (?, ?, ?, ?)',
      [
        body.owner_id,
        body.restaurant_name,
        body.cuisine_type,
        body.address,
      ],
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      restaurant_name: string;
      cuisine_type: string;
      address: string;
      is_active: number;
    },
  ) {
    return await this.databaseService.query(
      'UPDATE Restaurants SET restaurant_name = ?, cuisine_type = ?, address = ?, is_active = ? WHERE restaurant_id = ?',
      [
        body.restaurant_name,
        body.cuisine_type,
        body.address,
        body.is_active,
        Number(id),
      ],
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.databaseService.query(
      'DELETE FROM Restaurants WHERE restaurant_id = ?',
      [Number(id)],
    );
  }
}

