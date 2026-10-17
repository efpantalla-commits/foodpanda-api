
import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(
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

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ) {
    return await this.usersService.login(body.email, body.password);
  }
}
