
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Post()
  async create(
    @Body()
    body: {
      full_name: string;
      email: string;
      password: string;
      phone_number: string;
      role: string;
    },
  ) {
    return await this.usersService.create(
      body.full_name,
      body.email,
      body.password,
      body.phone_number,
      body.role,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      full_name: string;
      email: string;
      phone_number: string;
      role: string;
    },
  ) {
    return await this.usersService.update(
      Number(id),
      body.full_name,
      body.email,
      body.phone_number,
      body.role,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(Number(id));
  }
}
