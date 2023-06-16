import { UserService } from './user.service';
import { User } from './models/user.entity';
import { UserCreateDto } from './models/user-create.dto';
import { UserUpdateDto } from './models/user-updated.dto';
export declare class UserController {
    private UserService;
    constructor(UserService: UserService);
    all(page?: number): Promise<User[]>;
    create(body: UserCreateDto): Promise<User>;
    get(id: number): Promise<User>;
    update(id: number, body: UserUpdateDto): Promise<User>;
    delete(id: number): Promise<any>;
}
