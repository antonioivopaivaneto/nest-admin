import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
    constructor(private roleService:RoleService){}

    @Get()
    async all(){
        return this.roleService.all();
    }

    @Post()
    async create(
        @Body('name') name:string,
        @Body(' ') ids:number[]

        ){
            /*
                [1,2]

                [
                    {id:1},{id:2}
                ]
            */
        return this.roleService.create({
            name,
            permissions:ids.map(id => ({id}))
        })
    }

    
  @Get(':id')
  async get(@Param('id' )id:number){
    return this.roleService.findOne({ where:{id}, relations:['permissions']});
  } 

  @Put(':id')
  async update(
    @Param('id') id:number,
    @Body('name') name:string,
    @Body('permissions') ids:number[]


 
  ){

    await this.roleService.update(id, {name})

    const role = await  this.roleService.findOne({where:{id}});
    
    return this.roleService.create({
        ...role,
        Permissions: ids.map(id => ({id}))
    });
  } 

  @Delete(':id')
  async delete(@Param('id') id: number){
    return this.roleService.delete(id)
  }


}
