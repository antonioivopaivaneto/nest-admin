import { Role } from 'src/role/role.entity';
export declare class User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: Role;
}
