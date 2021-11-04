import { STATUS_CODE } from '@shared/db.receiver';
import { IResolvers } from 'graphql-tools';
import { getWorldList } from 'src/database/service/world.service';

const worldResolver: IResolvers = {
    Query: {
        async worldList(): Promise<Array<object>> {
            const result = await getWorldList();
            if (result.status == STATUS_CODE.SUCCESS) return result.data;
            else throw new Error(result.err);
        },
    },
};

export default worldResolver;
