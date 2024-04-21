import { DynamicModule, Provider } from "@nestjs/common";
import { TYPEORM_CUSTOM_REPOSITORY } from "./custom-decorator-repository";
import { TypeOrmModule, getDataSourceToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

export class CustomTypeOrmModule{
    public static forCustomRepository<T extends new (...args: any[]) => any>(repositories: T[]): DynamicModule {
        const providers: Provider[] = [];

        for(const repository of repositories){
            const entity = Reflect.getMetadata(TYPEORM_CUSTOM_REPOSITORY, repository);

            if(!entity){
                continue;
            }

            providers.push({
                inject: [getDataSourceToken()],
                provide: repository,
                useFactory: (datasource: DataSource): typeof repository => {
                    const baseRepository = datasource.getRepository<any>(entity);
                    return new repository(baseRepository.target, baseRepository.manager, baseRepository.queryRunner);
                },
            });
        }

        return {
            exports: providers,
            module: TypeOrmModule,
            providers,
        };
    }
}