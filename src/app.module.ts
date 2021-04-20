import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { typeOrmConifg } from './config/typeOrmConfig';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

dotenv.config();

@Module({
    imports: [TypeOrmModule.forRoot(typeOrmConifg), AuthModule, UserModule]
})
export class AppModule {}
