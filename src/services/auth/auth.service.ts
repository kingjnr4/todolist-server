import { OtpType } from '@prisma/client';
import { OtpService } from './../otp/otp.service';
import { loginDto } from './../../dtos/auth/login.dto';
import { comparePassword, hashPassword, signJwt } from '../../utils/helper';
import { createUserDto } from './../../dtos/user/create-user.dto';
import { UserService } from './../users/users.service';
import HttpException from '../../utils/exception';
import httpStatus from 'http-status';
import Mailer from '../../utils/mailer';
export class AuthService {
    private  userService
    private   otpService 
    constructor(){
        this.userService= new UserService()
        this.otpService=new OtpService()
    }
    async register(dto:createUserDto){
        dto.body.password= await hashPassword(dto.body.password)
        const user = await this.userService.create(dto)
        const otp = this.otpService.createOtp(user.id,OtpType.register)
        const message = `You have requested a registration on email ${user.email} please verify your otp ${otp}`
        await Mailer.getInstance().sendMailWithoutTemplate(user.email,"Welcome to taskmaster",message)
        const jwt = signJwt(user)
        return {jwt,user}

    }
    async login(dto:loginDto){
        const user = await this.userService.findByEmail(dto.body.email)
        const validPass = await comparePassword(dto.body.password,user.password)
        if(!validPass){
            throw new HttpException(httpStatus.UNAUTHORIZED,'Invalid Credentials')
        }
        const jwt = signJwt(user)
        return {jwt,user}

    }
}