import { StudentType } from './../student/student.type';
import { ObjectType, Field, ID } from "@nestjs/graphql"

@ObjectType('Lesson')
export class LessonType {
    @Field(type => ID)
    id: string

    @Field()
    name: string

    @Field()
    startDate: string

    @Field()
    endDate: string

    @Field(type => [StudentType])
    students: string[]
}