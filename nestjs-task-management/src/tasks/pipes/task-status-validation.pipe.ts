import { TaskStatus } from '../task-status.enum';
import { PipeTransform, BadRequestException } from "@nestjs/common";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE
    ]

    transform(value: string): string {
        value = value.toUpperCase()

        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`${value} is an invalid status`)
        }

        return value
    }

    private isStatusValid(status: string): boolean {
        return this.allowedStatuses.some(allowedStatus => allowedStatus === status)
    }
}