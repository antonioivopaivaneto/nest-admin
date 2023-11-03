import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { PaginateResult } from "../common/paginated-result.interface";
export declare class OrderService extends AbstractService {
    private readonly orderRepository;
    constructor(orderRepository: Repository<Order>);
    paginate(page?: number, relations?: any[]): Promise<PaginateResult>;
    chart(): Promise<any>;
}
