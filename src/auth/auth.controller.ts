
import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.usersService.create(
      body.full_name,
      body.email,
      body.password,
      body.phone_number,
      body.role,
    );
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const result = await this.usersService.login(
      body.email,
      body.password,
    );

    if (!result.user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const access_token = await this.jwtService.signAsync({
      sub: result.user.user_id,
      email: result.user.email,
      role: result.user.role,
    });

    return {
      message: 'Login successful',
      access_token,
      user: result.user,
    };
  }
}
