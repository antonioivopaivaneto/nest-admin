import { Body,Query,  ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors, Req, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.entity';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from './models/user-create.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserUpdateDto } from './models/user-updated.dto';
import { AuthService } from 'src/auth/auth.service';
import { Request} from 'express';
import { HasPermission } from 'src/permission/has-permission.decorator';
@UseInterceptors(ClassSerializerInterceptor )
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
    constructor(
      private UserService:UserService,
      private authService:AuthService){}
    
  @Get()
  //@HasPermission('users')    
  async all(@Query('page')page=1) {
    return  this.UserService.paginate(page,['role']);
  }
 
  @Post()
  async create(@Body() body:UserCreateDto): Promise<User>{
    const password = await bcrypt.hash('1234',12)
    
    //const {role_id, ...data} = body;

    return this.UserService.create({
     first_name: body.first_name,
     last_name: body.last_name,
     email: body.email,
      password,
      role:body.role_id
    })

  }

  @Get(':id')
  async get(@Param('id')id:number){
    return this.UserService.findOne( {id},['role'] );
  }

  @Put('info')
  async updateInfo(
    @Req() request: Request,
    @Body() body: UserUpdateDto
  ){
    const id = await this.authService.userId(request); 

    await this.UserService.update(id, body)

    return this.UserService.findOne({where:{id}});
  } 
  

  @Put('password')
  async updatePassword(
    
    @Req() request: Request,
    @Body('password') password: string,
    @Body('password_confirm') password_confirm: string,
    ){
      if(password !== password_confirm){
        throw new BadRequestException('Passwords do not match!')
    }

    const id = await this.authService.userId(request);
    
    const hashed = await bcrypt.hash(password,12)


    await this.UserService.update(id, {
      password:hashed
       
    })

    return this.UserService.findOne({where:{id}});

  }



  @Put(':id')
  async update(
    @Param('id') id:number,
    @Body() body: UserUpdateDto
  ){

    const {role_id, ...data} = body;
    await this.UserService.update(id, {
      ...data,
      role:{id:role_id}
    })

    return this.UserService.findOne({id});
  } 

  @Delete(':id')
  async delete(@Param('id') id: number){
    return this.UserService.delete(id)
  }

  

  
}
