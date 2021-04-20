import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as config from 'config';

dotenv.config();
const dbConfig = config.get('db');

export const typeOrmConifg: TypeOrmModuleOptions = {
    type: dbConfig.type,
    url: process.env.DB_URL,
    entities: [path.join(process.cwd(), 'dist', '**/**.entity.js')],
    synchronize: dbConfig.synchronize,
    useNewUrlParser: dbConfig.useNewUrlParser,
    useUnifiedTopology: dbConfig.useUnifiedTopology,
    logging: dbConfig.logging
};
