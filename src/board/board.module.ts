import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { Board, BoardSchema } from './board.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { TaskModule } from 'src/task/task.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]),
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
        forwardRef(() => TaskModule)
    ],
    providers: [BoardService],
    controllers: [BoardController],
    exports: [BoardService]
})
export class BoardModule {}
