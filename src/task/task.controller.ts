import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Schema as MongooseSchema } from 'mongoose';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from 'src/user/user.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskDto } from './dto/get-task.dto';
import { TaskService } from './task.service';

@Controller('task')
@UseGuards(AuthGuard())
export class TaskController {
    constructor(private taskService: TaskService) {}

    @Get(':taskId')
    public async getTaskById(
        @Param('taskId') taskId: MongooseSchema.Types.ObjectId
    ): Promise<GetTaskDto> {
        return await this.taskService.getTaskById(taskId);
    }

    @Get('/board/:boardId')
    public async getTasksByBoard(
        @GetUser() user: User,
        @Param('boardId') boardId: MongooseSchema.Types.ObjectId,
        @Query('status') status?: string
    ): Promise<GetTaskDto[]> {
        return await this.taskService.getTasksByBoard(user, boardId, status);
    }

    @Post()
    public async createTask(
        @Body(ValidationPipe) createTaskDto: CreateTaskDto
    ): Promise<MongooseSchema.Types.ObjectId> {
        return await this.taskService.createTask(createTaskDto);
    }

    @Put(':taskId')
    public async updateTask(
        @Param('taskId') taskId: MongooseSchema.Types.ObjectId,
        @Body(ValidationPipe) createTaskDto: Partial<CreateTaskDto>
    ): Promise<GetTaskDto> {
        return await this.taskService.updateTask(taskId, createTaskDto);
    }

    @Delete(':taskId')
    public async deleteTask(@Param('taskId') taskId: MongooseSchema.Types.ObjectId): Promise<void> {
        return await this.taskService.deleteTask(taskId);
    }
}
