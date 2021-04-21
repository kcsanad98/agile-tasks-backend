import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { BoardModule } from 'src/board/board.module';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';

const userModelConfig = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]);

@Module({
    imports: [userModelConfig, forwardRef(() => AuthModule), forwardRef(() => BoardModule)],
    controllers: [UserController],
    providers: [UserService],
    exports: [userModelConfig, UserService]
})
export class UserModule {}
