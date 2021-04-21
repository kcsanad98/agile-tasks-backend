import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { UserModule } from './user/user.module';

dotenv.config();

@Module({
    imports: [
        MongooseModule.forRoot(process.env.DB_URL, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }),
        AuthModule,
        BoardModule,
        UserModule
    ]
})
export class AppModule {}
