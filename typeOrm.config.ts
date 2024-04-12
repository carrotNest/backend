import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { DataSource } from "typeorm";
import * as path from 'path';

config();

const configService = new ConfigService();

export default new DataSource({
    type: 'mysql',
    host: configService.get('MIGRATION_HOST'),
    port: +configService.get('DB_PORT'),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    migrations: ['migrations/**'],
    entities: [path.join(__dirname, './modules/*/entity/*.entity.{ts,js}')],
});