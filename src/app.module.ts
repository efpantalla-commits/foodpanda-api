
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';
import { RestaurantsController } from './restaurants/restaurants.controller';
import { CategoriesController } from './categories/categories.controller';
import { MenuItemsController } from './menu-items/menu-items.controller';
import { OrdersController } from './orders/orders.controller';
import { OrderItemsController } from './order-items/order-items.controller';
import { DeliveriesController } from './deliveries/deliveries.controller';
import { PaymentsController } from './payments/payments.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
  ],
  controllers: [
    AppController,
    RestaurantsController,
    CategoriesController,
    MenuItemsController,
    OrdersController,
    OrderItemsController,
    DeliveriesController,
    PaymentsController,
  ],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
