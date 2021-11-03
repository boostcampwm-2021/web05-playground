import { IResolvers } from 'graphql-tools';
import { IWorld } from 'src/database/entities/World';
import { getWorldList } from 'src/database/service/world.service';

const worldResolver: IResolvers = {
    Query: {
        async worldList(): Promise<Array<IWorld>> {
            return await getWorldList();
        },
    },
};

export default worldResolver;
