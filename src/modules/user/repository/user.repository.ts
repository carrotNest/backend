import { CustomRepository } from "../../../config/mysql/custom-decorator-repository";
import { User } from "../entity/user.entity";
import { Repository } from "typeorm";

@CustomRepository(User)
export class UserRepository extends Repository<User> {

    async saveUser(userEntity: User): Promise<User> {
        return await this.save(userEntity);
    }

    async findUserById(userId: number): Promise<User|null> {
        return await this.findOne({where: {id: userId}});
    }

    async findUserByAccountId(accountId: string): Promise<User|null> {
        return await this.findOneBy({accountId});
    }

    async isAccountIDExist(accountId: string): Promise<Boolean> {
        const accountExist = await this.findOne({where: {accountId: accountId}});
        return !!accountExist;
    }

    async isNicknameExist(nickname: string): Promise<Boolean> {
        const nicknameExist = await this.findOne({where: {nickname: nickname}});
        return !!nicknameExist;
    }

    async findUserRegionById(userId: number): Promise<User|null> {
        return await this.findOne({
            where: {id: userId},
            relations: ['region']
        });
    }
}