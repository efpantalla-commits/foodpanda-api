
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  async findAll() {
    return await this.databaseService.query(
      'SELECT * FROM Orders',
    );
  }

  @Post()
  async create(
    @Body()
    body: {
      customer_id: number;
      restaurant_id: number;
      total_amount: number;
      order_status: string;
      delivery_address: string;
    },
  ) {
    return await this.databaseService.query(
      'INSERT INTO Orders (customer_id, restaurant_id, total_amount, order_status, delivery_address) VALUES (?, ?, ?, ?, ?)',
      [
        body.customer_id,
        body.restaurant_id,
        body.total_amount,
        body.order_status,
        body.delivery_address,
      ],
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      customer_id: number;
      restaurant_id: number;
      total_amount: number;
      order_status: string;
      delivery_address: string;
    },
  ) {
    return await this.databaseService.query(
      'UPDATE Orders SET customer_id = ?, restaurant_id = ?, total_amount = ?, order_status = ?, delivery_address = ? WHERE order_id = ?',
      [
        body.customer_id,
        body.restaurant_id,
        body.total_amount,
        body.order_status,
        body.delivery_address,
        Number(id),
      ],
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.databaseService.query(
      'DELETE FROM Orders WHERE order_id = ?',
      [Number(id)],
    );
  }
}
