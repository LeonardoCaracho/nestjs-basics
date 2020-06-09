import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto

        const user = new User()
        user.username = username
        user.salt = await bcrypt.genSalt()
        user.password = await this.hashPassword(password, user.salt)

        try {
            await user.save()
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Username already exists')
            }
            throw new InternalServerErrorException()
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto
        const user = await this.findOne({ username })

        if (user && await user.validatePassword(password)){
            return user.username
        }

        return null
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt)
    }
}