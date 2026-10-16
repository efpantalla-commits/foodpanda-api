
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  async findAll() {
    return await this.databaseService.query(
      'SELECT * FROM OrderItems',
    );
  }

  @Post()
  async create(
    @Body()
    body: {
      order_id: number;
      item_id: number;
      quantity: number;
      subtotal: number;
    },
  ) {
    return await this.databaseService.query(
      'INSERT INTO OrderItems (order_id, item_id, quantity, subtotal) VALUES (?, ?, ?, ?)',
      [
        body.order_id,
        body.item_id,
        body.quantity,
        body.subtotal,
      ],
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      order_id: number;
      item_id: number;
      quantity: number;
      subtotal: number;
    },
  ) {
    return await this.databaseService.query(
      'UPDATE OrderItems SET order_id = ?, item_id = ?, quantity = ?, subtotal = ? WHERE order_item_id = ?',
      [
        body.order_id,
        body.item_id,
        body.quantity,
        body.subtotal,
        Number(id),
      ],
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.databaseService.query(
      'DELETE FROM OrderItems WHERE order_item_id = ?',
      [Number(id)],
    );
  }
}
