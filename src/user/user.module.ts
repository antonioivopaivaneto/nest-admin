import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { User } from './models/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { CommonModule } from 'src/common/common.module';

@Module({
    imports:[
        TypeOrmModule.forFeature([User]),
        CommonModule 
    ],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}
