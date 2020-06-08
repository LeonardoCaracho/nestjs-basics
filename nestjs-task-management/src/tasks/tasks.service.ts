import { User } from './../auth/user.entity';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-task-dto';
import { Injectable, NotFoundException, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {}

    async getTasks(
        filterDto: GetTasksFilterDto,
        user: User
    ): Promise<Task[]>{
        return await this.taskRepository.getTasks(filterDto, user)
    }

    async getTaskById(
        id: number, 
        user: User
    ): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { id, userId: user.id} })

        if (!found){
            throw new NotFoundException(`Task with id "${id}" not found`)
        }

        return found
    }

    async createTask(
        createTaskDto: CreateTaskDto,
        user: User
    ): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user)
    }

    async deleteTask(
        id: number, 
        user: User
    ): Promise<void> {
        const result = await this.taskRepository.delete({ id, userId: user.id })
        
        if (result.affected === 0){
            throw new NotFoundException(`Task with id "${id}" not found`)
        }
    }

    async updateTaskStatus(
        id: number, 
        status: TaskStatus,
        user: User
    ): Promise<Task> {
        const task: Task = await this.getTaskById(id, user)

        task.status = status
        await task.save()
        return task
    }
}
