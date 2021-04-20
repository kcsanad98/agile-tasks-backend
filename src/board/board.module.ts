import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { UserRepository } from 'src/user/user.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UserBoardRepository } from './user-board.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([BoardRepository, UserRepository, UserBoardRepository]),
        AuthModule
    ],
    providers: [BoardService],
    controllers: [BoardController]
})
export class BoardModule {}
