import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PaginateResult } from './paginated-result.interface';

@Injectable()
export abstract class AbstractService {

    protected constructor(
        protected readonly repository: Repository<any>
    ){}
     


    async all(relations = []): Promise<any[]>{
        return await this.repository.find({where:relations});
    }

    async paginate(page:number = 1, relations = []):Promise<PaginateResult>{
        const take = 5;

        const [data,total] = await this.repository.findAndCount({
            take,
            skip:(page - 1) * take,
            relations  
        });

        return {
            data:data,            
            meta:{
                total,
                page,
                last_page:Math.ceil(total/take)

            }
        }
    }

    async create(data):Promise<any>{
        return this.repository.save(data)
    }

    async findOne(condition, relations=[]): Promise<any> {
        return this.repository.findOne({
            where:condition,
            relations});
      }

      
    async find(email): Promise<any> {
        return this.repository.findOne({where:{email}});
      }

      async update(id:number,data): Promise<any>{
        return this.repository.update(id,data)
      }

    async delete(id:number):Promise<any>{
        return this.repository.delete(id);
    }

}
