import { StudentResolver } from './student.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from './student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student
    ])
  ],
  exports: [
    StudentService
  ],
  providers: [StudentService, StudentResolver]
})
export class StudentModule {}
