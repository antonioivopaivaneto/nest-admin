import { User } from './models/user.entity';
import { Repository } from 'typeorm';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    all(): Promise<User[]>;
    paginate(page?: number): Promise<any>;
    create(data: any): Promise<User>;
    findOne(conditions: any): Promise<User | undefined>;
    update(id: number, data: any): Promise<any>;
    delete(id: number): Promise<any>;
}
