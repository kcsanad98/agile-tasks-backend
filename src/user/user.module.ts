import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BoardModule } from 'src/board/board.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserRepository]), AuthModule, BoardModule],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}
