import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { StudentService } from './student.service';
import { CreateStudentInput } from './student.input';
import { StudentType } from './student.type';

@Resolver(of => StudentType)
export class StudentResolver {
    constructor (
        private studentService: StudentService
    ) {}

    @Mutation(returns => StudentType)
    createStudent(
        @Args('createStudentInput') createStudentInput: CreateStudentInput
    ) {
        return this.studentService.createStudent(createStudentInput)
    }

    @Query(returns => [StudentType])
    async students() {
        return this.studentService.getStudents()
    }

    @Query(returns => StudentType)
    async student(
        @Args('id') id: string
    ) {
        return this.studentService.getStudentById(id)
    }
}