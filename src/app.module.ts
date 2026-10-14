import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController, UsersController],
  providers: [AppService, DatabaseService, UsersService],
})
export class AppModule {}