
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  async findAll() {
    return await this.databaseService.query(
      'SELECT * FROM Payments',
    );
  }

  @Post()
  async create(
    @Body()
    body: {
      order_id: number;
      payment_method: string;
      payment_status: string;
      transaction_reference?: string;
    },
  ) {
    return await this.databaseService.query(
      'INSERT INTO Payments (order_id, payment_method, payment_status, transaction_reference) VALUES (?, ?, ?, ?)',
      [
        body.order_id,
        body.payment_method,
        body.payment_status,
        body.transaction_reference ?? null,
      ],
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      order_id: number;
      payment_method: string;
      payment_status: string;
      transaction_reference?: string;
    },
  ) {
    return await this.databaseService.query(
      'UPDATE Payments SET order_id = ?, payment_method = ?, payment_status = ?, transaction_reference = ? WHERE payment_id = ?',
      [
        body.order_id,
        body.payment_method,
        body.payment_status,
        body.transaction_reference ?? null,
        Number(id),
      ],
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.databaseService.query(
      'DELETE FROM Payments WHERE payment_id = ?',
      [Number(id)],
    );
  }
}
