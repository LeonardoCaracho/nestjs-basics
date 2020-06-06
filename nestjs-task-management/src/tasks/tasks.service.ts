import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-task-dto';
import { Task, TaskStatus } from './task.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as uuid from 'uuid'

@Injectable()
export class TasksService {
    private tasks: Task[] = []

    getAllTasks(): Task[] {
        return this.tasks
    }

    getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
        const { status, search } = filterDto

        let tasks = this.getAllTasks()

        if (status) {
            tasks = tasks.filter(task => task.status === status)
        }

        if (search) {
            tasks = tasks.filter(task => 
                task.title.includes(search) ||
                task.description.includes(search)
            )
        }

        return tasks
    }

    getTaskById(id: string): Task {
        const task = this.tasks.find(task => task.id === id)

        if (!task){
            throw new NotFoundException(`Task with id "${id}" not found`)
        }

        return task
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto
        const id = uuid.v1()

        const task: Task = {
            id,
            title,
            description,
            status: TaskStatus.OPEN
        }

        this.tasks.push(task)
        return task
    }

    deleteTask(id: string): void {
        const taskDelete = this.getTaskById(id)
        this.tasks = this.tasks.filter(task => task.id != taskDelete.id)
    }

    updateTaskStatus(id: string, status: TaskStatus ): Task {
        const task: Task = this.getTaskById(id)

        task.status = status
        return task
    }
}
