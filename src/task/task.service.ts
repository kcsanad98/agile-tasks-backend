import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { BoardService } from 'src/board/board.service';
import { User } from 'src/user/user.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskDto } from './dto/get-task.dto';
import { Task, TaskDocument } from './task.schema';

@Injectable()
export class TaskService {
    constructor(
        @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
        @Inject(forwardRef(() => BoardService)) private boardService: BoardService
    ) {}

    public async getTaskById(taskId: MongooseSchema.Types.ObjectId): Promise<GetTaskDto> {
        const task = await this.taskModel.findById(taskId).exec();
        if (!task) {
            throw new NotFoundException(`Task with id ${taskId} not found`);
        }
        return this.transformTask(task);
    }

    public async getTasksByBoard(
        user: User,
        boardId: MongooseSchema.Types.ObjectId
    ): Promise<GetTaskDto[]> {
        const board = await this.boardService.getBoardById(user, boardId);
        return board.tasks;
    }

    public async createTask(createTaskDto: CreateTaskDto): Promise<MongooseSchema.Types.ObjectId> {
        const createdTask: TaskDocument = await new this.taskModel(createTaskDto).save();
        const taskId = createdTask._id;
        this.boardService.addTaskToBoard(taskId, createTaskDto.board);
        return taskId;
    }

    public async updateTask(
        taskId: MongooseSchema.Types.ObjectId,
        createTaskDto: CreateTaskDto
    ): Promise<GetTaskDto> {
        await this.taskModel
            .findByIdAndUpdate(taskId, createTaskDto, { useFindAndModify: false })
            .exec();
        return await this.getTaskById(taskId);
    }

    public async deleteTask(taskId: MongooseSchema.Types.ObjectId): Promise<void> {
        const taskToDelete = await this.taskModel.findById(taskId).exec();
        if (!taskToDelete) {
            throw new NotFoundException(`Task with id ${taskId} not found`);
        }
        await this.boardService.removeTaskFromBoard(taskId, taskToDelete.board);
        await this.taskModel.findByIdAndDelete(taskId).exec();
    }

    public transformTask(task): GetTaskDto {
        const getTaskDto: GetTaskDto = {
            id: task._id,
            title: task.title,
            description: task.description,
            status: task.status
        };
        return getTaskDto;
    }
}
