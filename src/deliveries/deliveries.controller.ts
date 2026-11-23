
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
      [body.order_id, body.rider_id, body.delivery_status],
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
      [body.order_id, body.rider_id, body.delivery_status, Number(id)],
    );
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { delivery_status: string },
    @Req() req: any,
  ) {
    if (req.user.role !== 'Rider') {
      throw new ForbiddenException('Only riders can update deliveries.');
    }

    const allowedStatuses = ['Assigned', 'Picked Up', 'Delivered'];

    if (!allowedStatuses.includes(body.delivery_status)) {
      throw new BadRequestException('Invalid delivery status.');
    }

    const delivery = await this.databaseService.query(
      'SELECT * FROM Deliveries WHERE delivery_id = ? AND rider_id = ?',
      [Number(id), req.user.user_id],
    );

    if (!Array.isArray(delivery) || delivery.length === 0) {
      throw new NotFoundException('Delivery not found or not assigned to you.');
    }

    return await this.databaseService.query(
      'UPDATE Deliveries SET delivery_status = ? WHERE delivery_id = ? AND rider_id = ?',
      [body.delivery_status, Number(id), req.user.user_id],
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
