import { User } from './user.entity';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing'
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs'


const mockCredentialsDto = { username: 'TestUsername', password: 'TestPassword' }

//defining access to the user repository
describe('UserRepository', () => {
    let userRepository

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserRepository
            ]
        }).compile()

        userRepository = await module.get<UserRepository>(UserRepository)
    })
    
    describe('SignUP', () => {
        let save
        
        beforeEach(() => {
            save = jest.fn()
            userRepository.create = jest.fn().mockReturnValue({ save })
        })
        
        it('Succesfully signs up the user', () => {
            save.mockResolvedValue(undefined)
            expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow()
        })

        it('Throws a conflict exception as username already exists', () => {
            save.mockRejectedValue({ code: '23505' })
            expect(userRepository.signUp(mockCredentialsDto)).resolves.toThrow(ConflictException)
        })

        it('Throws a exception for unhandled error code ', () => {
            save.mockRejectedValue({ code: '233232' })
            expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException)
        })
    })

    describe('validateUserPassword', () => {
        let user

        beforeEach(() => {
            userRepository.findOne = jest.fn()
            user = new User()
            user.username = 'TestUsername'
            user.validatePassword = jest.fn()
        })

        it('returns the username if validation succesful', async () => {
            userRepository.findOne.mockResolvedValue(user)
            user.validatePassword.mockResolvedValue(true)

            const result = await userRepository.validateUserPassword(mockCredentialsDto)
            expect(result).toEqual('TestUsername')
        })

        it('returns null as user cannot be found', async () => {
            userRepository.findOne.mockResolvedValue(null)
            const result = await userRepository.validateUserPassword(mockCredentialsDto)
            expect(user.validatePassword).not.toHaveBeenCalled()
            expect(result).toBeNull()
        })

        it('returns null aif a password is invalid', async () => {
            userRepository.findOne.mockResolvedValue(null)
            user.validatePassword.mockResolvedValue(false)
            const result = await userRepository.validateUserPassword(mockCredentialsDto)
            expect(user.validatePassword).not.toHaveBeenCalled()
            expect(result).toBeNull()
        })
    })

    describe('hashPassword', () => {
        it('call bcrypt.hash to generate a hash', async () => {
            bcrypt.hash = jest.fn().mockResolvedValue('testHash')
            expect(bcrypt.hash).not.toHaveBeenCalled()
            const result = await userRepository.hashPassword('testPassword', 'testSalt')
            expect(bcrypt.hash).toHaveBeenCalled()
            expect(result).toEqual('testHash')
        })
    })

})