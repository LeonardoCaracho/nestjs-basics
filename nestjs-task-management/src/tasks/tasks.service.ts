import { CreateTaskDto } from './dto/create-task-dto';
import { Task, TaskStatus } from './task.model';
import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid'

@Injectable()
export class TasksService {
    private tasks: Task[] = []

    getAllTasks(): Task[] {
        return this.tasks
    }

    getTaskById(id: string): Task {
        const task = this.tasks.find(task => task.id === id)
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
}
