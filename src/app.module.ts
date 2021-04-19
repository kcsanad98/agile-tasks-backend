import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { typeOrmConifg } from './config/typeOrmConfig';

dotenv.config();

@Module({
    imports: [TypeOrmModule.forRoot(typeOrmConifg)]
})
export class AppModule {}
