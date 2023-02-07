import { OtpType } from '@prisma/client';
import { OtpService } from './../otp/otp.service';
import { loginDto } from './../../dtos/auth/login.dto';
import { comparePassword, hashPassword, signJwt } from '../../utils/helper';
import { createUserDto } from './../../dtos/user/create-user.dto';
import { UserService } from './../users/users.service';
import HttpException from '../../utils/exception';
import httpStatus from 'http-status';
import Mailer from '../../utils/mailer';
import { sendPasswordResetDto } from '../../dtos/auth/sendPassword.otp';
import { verifyOtpDto } from '../../dtos/auth/verify.dto';
export class AuthService {
    private userService = new UserService()
    private otpService = new OtpService()

    async register(dto: createUserDto) {
        dto.body.password = await hashPassword(dto.body.password)
        const user = await this.userService.create(dto)
        const otp = await this.otpService.createOtp(user.id, OtpType.register)
        const message = `You have requested a registration on email ${user.email} please verify your otp ${otp.token}`
        await Mailer.getInstance().sendMailWithoutTemplate(user.email, "Welcome to taskmaster", message)
        const jwt = signJwt(user)
        const { password, ...details } = user
        return { jwt, details }

    }
    async login(dto: loginDto) {
        const user = await this.userService.findByEmail(dto.body.email)
        const validPass = await comparePassword(dto.body.password, user.password)
        if (!validPass) {
            throw new HttpException(httpStatus.UNAUTHORIZED, 'Invalid Credentials')
        }
        const jwt = signJwt(user)
        const { password, ...details } = user
        return { jwt, details }

    }

    async verify( dto: verifyOtpDto) {
        const user = await this.otpService.findUser(dto.body.token)
        if(!user)throw new HttpException(httpStatus.NOT_FOUND,'User Not found')
        if (!dto.body.password && dto.body.type == 'reset') throw new HttpException(httpStatus.BAD_REQUEST, 'Required password field')
        const password = hashPassword(dto.body.password as string)
        const verified = await this.otpService.verify(user.id, dto.body.token, dto.body.type)
        if (verified) {
            switch (dto.body.type) {
                case 'register':
                    return await this.userService.updateFields(user.id, {
                        verified: true
                    })
                case 'reset':
                    return await this.userService.updateFields(user.id, {
                        password
                    })

            }
        }
        return null
    }

    async resend(id: string) {
        const otp = await this.otpService.createOtp(id, OtpType.register)
        const user = await this.userService.findByEmail(id)
        const message = `You have requested a registration on email ${user.email} please verify your otp ${otp.token}`
        await Mailer.getInstance().sendMailWithoutTemplate(user.email, "Welcome to taskmaster", message)
    }

    async sendPasswordReset(dto: sendPasswordResetDto) {
        const user = await this.userService.findOne(dto.body.email)
        const otp = await this.otpService.createOtp(user.id, OtpType.reset)
        const message = `You have requested a passowrd change on email ${user.email} please verify your otp ${otp.token}`
        await Mailer.getInstance().sendMailWithoutTemplate(user.email, "Password Reset", message)
    }
}