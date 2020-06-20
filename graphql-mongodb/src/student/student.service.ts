import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateStudentInput } from './student.input';
import { v4 as uuid } from 'uuid'
import { Student } from './student.entity';

@Injectable()
export class StudentService {
    constructor (
        @InjectRepository(Student) private studentRepository: Repository<Student>
    ) {}

    async createStudent(createStudentInput: CreateStudentInput): Promise<Student> {
        const { firstName, lastName } = createStudentInput

        const student = this.studentRepository.create({
            id: uuid(),
            firstName,
            lastName
        })

        return this.studentRepository.save(student)
    }

    async getStudents(): Promise<Student[]> {
        return this.studentRepository.find()
    }

    async getStudentById(id: string): Promise<Student> {
        return this.studentRepository.findOne({ id })
    }

    async getManyStudents(studentIds: string[]): Promise<Student[]> {
        return this.studentRepository.find({
            where: {
                id: {
                    $in: studentIds
                }
            }
        })
    }
    
}
