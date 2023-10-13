import { Module } from '@nestjs/common';
import { Utils } from './utils.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UtilsController } from './utils.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600Ss' },
    }),
  ],
  controllers: [UtilsController],
  providers: [Utils],
  exports: [Utils],
})
export class UtilsModule {}
