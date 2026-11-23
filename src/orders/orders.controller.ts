
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
  Patch,
  ForbiddenException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly databaseService: DatabaseService) {}

  // GET ALL ORDERS
  @Get()
  async findAll() {
    return await this.databaseService.query(
      'SELECT * FROM Orders',
    );
  }

  // GET MY ORDERS
  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  async findMyOrders(@Req() req: any) {
    return await this.databaseService.query(
      `SELECT
        o.*,
        r.restaurant_name,
        p.payment_method,
        p.payment_status
      FROM Orders o
      LEFT JOIN Restaurants r
        ON o.restaurant_id = r.restaurant_id
      LEFT JOIN Payments p
        ON o.order_id = p.order_id
      WHERE o.customer_id = ?
      ORDER BY o.created_at DESC`,
      [req.user.user_id],
    );
  }

  // CHECK STATUS COLUMN TYPES
  @Get('status-columns')
  async getStatusColumns() {
    return await this.databaseService.query(`
      SELECT TABLE_NAME, COLUMN_NAME, COLUMN_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'FoodPandaDB'
      AND (
        (TABLE_NAME = 'Orders' AND COLUMN_NAME = 'order_status')
        OR
        (TABLE_NAME = 'Payments' AND COLUMN_NAME = 'payment_status')
      )
    `);
  }

  // UPDATE ORDER STATUS
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() body: {
      order_status:
        | 'Pending'
        | 'Preparing'
        | 'Out for Delivery'
        | 'Delivered'
        | 'Cancelled';
    },
    @Req() req: any,
  ) {
    const allowedStatuses = [
      'Pending',
      'Preparing',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
    ];

    if (!allowedStatuses.includes(body.order_status)) {
      throw new ForbiddenException('Invalid order status.');
    }

    if (req.user.role === 'Vendor') {
      const orders = await this.databaseService.query(
        `SELECT o.order_id
         FROM Orders o
         INNER JOIN Restaurants r
           ON o.restaurant_id = r.restaurant_id
         WHERE o.order_id = ?
           AND r.owner_id = ?`,
        [Number(id), req.user.user_id],
      );

      if (!Array.isArray(orders) || orders.length === 0) {
        throw new ForbiddenException(
          'You are not authorized to update this order.',
        );
      }
    } else if (req.user.role !== 'Admin') {
      throw new ForbiddenException(
        'Only Admin or the restaurant owner can update order status.',
      );
    }

    return await this.databaseService.query(
      'UPDATE Orders SET order_status = ? WHERE order_id = ?',
      [body.order_status, Number(id)],
    );
  }

  // CREATE ORDER
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
      `INSERT INTO Orders
       (customer_id, restaurant_id, total_amount, order_status, delivery_address)
       VALUES (?, ?, ?, ?, ?)`,
      [
        body.customer_id,
        body.restaurant_id,
        body.total_amount,
        body.order_status,
        body.delivery_address,
      ],
    );
  }

  // UPDATE COMPLETE ORDER
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
      `UPDATE Orders
       SET customer_id = ?, restaurant_id = ?, total_amount = ?,
           order_status = ?, delivery_address = ?
       WHERE order_id = ?`,
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

  // DELETE ORDER
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.databaseService.query(
      'DELETE FROM Orders WHERE order_id = ?',
      [Number(id)],
    );
  }
}
