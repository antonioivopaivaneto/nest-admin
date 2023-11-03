import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { group } from 'console';
import {PaginateResult} from "../common/paginated-result.interface";

@Injectable()
export class OrderService extends AbstractService {
    constructor(
        @InjectRepository(Order) private readonly orderRepository:Repository<Order> ){
        super(orderRepository);
    }
    async paginate(page = 1, relations = []):Promise<PaginateResult>{

        const {data,meta} = await super.paginate(page, relations);

        return {
            data:data.map((order:Order) =>({
                id:order.id,
                name:order.name,
                email:order.email,
                total:order.total,
                created_at:order.created_at,
                order_item:order.order_items

            })),
            meta
        }
    }

    async chart(){
        return this.orderRepository.query(
            `SELECT DATE_FORMAT(o.created_at, '%Y-%m-%d') as Date, sum(i.price * i.quantity) as sum
            FROM orders o 
            JOIN order_items i on o.id = i.order_id
            GROUP BY date`
        );
    }
}
