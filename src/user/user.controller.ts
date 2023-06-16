import { Body,Query,  ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.entity';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from './models/user-create.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserUpdateDto } from './models/user-updated.dto';

@UseInterceptors(ClassSerializerInterceptor )
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
    constructor(private UserService:UserService){}
    
  @Get()
  async all(@Query('page')page=1): Promise<User[]> {
    return await this.UserService.paginate(page);
  }
 
  @Post()
  async create(@Body() body:UserCreateDto): Promise<User>{
    const password = await bcrypt.hash('1234',12)
    return this.UserService.create({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password,
      role_id:body.role_id
    })

  }

  @Get(':id')
  async get(@Param('id' )id:number){
    return this.UserService.findOne({ where:{id}});
  }

  @Put(':id')
  async update(
    @Param('id') id:number,
    @Body() body: UserUpdateDto
 
  ){

    await this.UserService.update(id, body)

    return this.UserService.findOne({where:{id}});
  } 

  @Delete(':id')
  async delete(@Param('id') id: number){
    return this.UserService.delete(id)
  }

  

  
}
