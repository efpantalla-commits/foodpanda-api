
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  async findAll() {
    return await this.databaseService.query(
      'SELECT * FROM Deliveries',
    );
  }

  @Post()
  async create(
    @Body()
    body: {
      order_id: number;
      rider_id: number;
      delivery_status: string;
    },
  ) {
    return await this.databaseService.query(
      'INSERT INTO Deliveries (order_id, rider_id, delivery_status) VALUES (?, ?, ?)',
      [
        body.order_id,
        body.rider_id,
        body.delivery_status,
      ],
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      order_id: number;
      rider_id: number;
      delivery_status: string;
    },
  ) {
    return await this.databaseService.query(
      'UPDATE Deliveries SET order_id = ?, rider_id = ?, delivery_status = ? WHERE delivery_id = ?',
      [
        body.order_id,
        body.rider_id,
        body.delivery_status,
        Number(id),
      ],
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.databaseService.query(
      'DELETE FROM Deliveries WHERE delivery_id = ?',
      [Number(id)],
    );
  }
}
