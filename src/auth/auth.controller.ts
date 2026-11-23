
import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

  @Post('setup-admin')
  async setupAdmin(
    @Headers('x-admin-setup-key') setupKey: string,
    @Body()
    body: {
      full_name: string;
      email: string;
      password: string;
      phone_number: string;
    },
  ) {
    const savedKey =
      this.configService.get<string>('ADMIN_SETUP_KEY');

    if (!savedKey || !setupKey || setupKey !== savedKey) {
      throw new UnauthorizedException('Invalid setup key.');
    }

    return await this.usersService.createAdmin(
      body.full_name,
      body.email,
      body.password,
      body.phone_number,
    );
  }

  @Post('reset-admin-password')
  async resetAdminPassword(
    @Headers('x-admin-setup-key') setupKey: string,
    @Body()
    body: {
      email: string;
      password: string;
    },
  ) {
    const savedKey =
      this.configService.get<string>('ADMIN_SETUP_KEY');

    if (!savedKey || !setupKey || setupKey !== savedKey) {
      throw new UnauthorizedException('Invalid setup key.');
    }

    if (!body.password || body.password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters.',
      );
    }

    return await this.usersService.resetAdminPassword(
      body.email,
      body.password,
    );
  }
}
