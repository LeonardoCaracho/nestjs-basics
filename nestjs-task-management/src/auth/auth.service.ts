import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}
    
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        await this.userRepository.signUp(authCredentialsDto)
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const username = await this.userRepository.validateUserPassword(authCredentialsDto)

        if (!username) {
            throw new UnauthorizedException('Invalid Credentials')
        }

        const payload: JwtPayload = { username }
        const accessToken = this.jwtService.sign(payload)

        return { accessToken }
    }
}
