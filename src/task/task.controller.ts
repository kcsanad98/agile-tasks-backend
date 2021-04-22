import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { Schema as MongooseSchema } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('task')
export class TaskController {
    @Get(':taskId')
    public async getTaskById(@Param('taskId') taskId: MongooseSchema.Types.ObjectId) {}

    @Get('/board/:boardId')
    public async getTasksByBoard(@Param('boardId') boardId: MongooseSchema.Types.ObjectId) {}

    @Post('/board/:boardId')
    public async createTask(@Body(ValidationPipe) createTaskDto: CreateTaskDto) {}

    @Put(':taskId')
    public async updateTask(
        @Param('taskId') taskId: MongooseSchema.Types.ObjectId,
        @Body(ValidationPipe) createTaskDto: CreateTaskDto
    ) {}

    @Delete(':taskId')
    public async deleteTask(@Param('taskId') taskId: MongooseSchema.Types.ObjectId) {}
}
