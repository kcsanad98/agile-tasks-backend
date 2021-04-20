import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { typeOrmConifg } from './config/typeOrmConfig';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BoardModule } from './board/board.module';
import { TaskModule } from './task/task.module';

dotenv.config();

@Module({
    imports: [TypeOrmModule.forRoot(typeOrmConifg), AuthModule, UserModule, BoardModule, TaskModule]
})
export class AppModule {}
