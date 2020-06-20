import { AssignStudentsToLessonInput } from './assign-students-to-lesson.input';
import { CreateLessonInput } from './lesson.input';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid'
import { ResolveField, Parent } from '@nestjs/graphql';
import { Student } from 'src/student/student.entity';

@Injectable()
export class LessonService {
    constructor (
        @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>
    ) {}

    async createLesson(createLessonInput: CreateLessonInput): Promise<Lesson> {
        const { name, startDate, endDate, students } = createLessonInput
        const lesson = this.lessonRepository.create({
            id: uuid(),
            name,
            startDate,
            endDate,
            students
        })

        return this.lessonRepository.save(lesson)
    }

    async getLesson(id: string): Promise<Lesson> {
        return this.lessonRepository.findOne({ id })
    }

    async getLessons(): Promise<Lesson[]> {
        return this.lessonRepository.find()
    }

    async assignStudentsToLesson(assignStudentsToLessonInput: AssignStudentsToLessonInput): Promise<Lesson> {
        const { studentIds, lessonId } = assignStudentsToLessonInput
        const lesson = await this.lessonRepository.findOne({ id: lessonId })
        
        lesson.students = [...lesson.students, ...studentIds]

        return this.lessonRepository.save(lesson)
    }

}
