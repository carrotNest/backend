import { CustomRepository } from "../../../config/mysql/custom-decorator-repository";
import { Repository } from "typeorm";
import { Region } from "../entity/region.entity";

@CustomRepository(Region)
export class RegionRepository extends Repository<Region> {

    async findParentRegion(parentName: string): Promise<Region|null>{
        return await this.findOne({where: {name: parentName}});
    }

    async findRegion(regionName: string, parentRegion: Region): Promise<Region|null>{
        return await this.findOne({
            where:{
                name: regionName,
                parent: parentRegion
            }
        });
    }
}