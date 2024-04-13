import { Injectable } from "@nestjs/common";
import { RedisService as RedisDao } from "@songkeys/nestjs-redis";
import { Redis } from "ioredis";

@Injectable()
export class RefreshTokenService {
    private readonly redisClient: Redis;

    constructor(private readonly refreshTokenService: RedisDao){
        this.redisClient = this.refreshTokenService.getClient();
    }

    async setKey(key: string, value: string, ttl: number): Promise<void> {
        await this.redisClient.set(key, value, 'EX', ttl);
    }

    async getKey(key: string): Promise<string|null> {
        return this.redisClient.get(key);
    }
}