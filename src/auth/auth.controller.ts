import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, NotFoundException, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './models/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Response,Request, response } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@UseInterceptors(ClassSerializerInterceptor )
@Controller()
export class AuthController {
    constructor(
        private userService:UserService,
        private jwtService: JwtService,
        private authService:AuthService
        ){}

    @Post('register')
    async register(@Body() body: RegisterDto){

        if(body.password !== body.password_confirm){
            throw new BadRequestException('Passwords do not match!')
        }

        const hashed = await bcrypt.hash(body.password, 12);

        return this.userService.create({
            first_name: body.first_name,
            last_name:body.last_name,
            email:body.email,
            password:hashed,
            role:{id:4}

        });
    }

    @Post('login')
    async login(
         @Body('email') email:string,
         @Body('password') password:string,
         @Res({passthrough:true}) response: Response 
         ){
            const user = await this.userService.find(email);

            if(!user){
                throw new NotFoundException('User ot found')
            }

            if(!await bcrypt.compare(password,user.password)){
                throw new BadRequestException('invalid credentials')
            }

            const jwt = await this.jwtService.signAsync({id:user.id})

            response.cookie('jwt',jwt,{httpOnly:true})
            return user;

    }   

    @UseGuards(AuthGuard)
    @Get('user')
    async user(@Req() request : Request){
        const cookie = request.cookies['jwt'];

       const data = await this.jwtService.verifyAsync(cookie)

        return this.userService.findOne({id:data['id'] });


    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Res({passthrough:true}) response: Response){
            response.clearCookie('jwt');

            return{
                message:'Sucess'
            }
    }



}
