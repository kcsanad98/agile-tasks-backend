import { forwardRef, Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './task.schema';
import { BoardModule } from 'src/board/board.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
        forwardRef(() => BoardModule),
        forwardRef(() => AuthModule)
    ],
    controllers: [TaskController],
    providers: [TaskService],
    exports: [TaskService]
})
export class TaskModule {}
