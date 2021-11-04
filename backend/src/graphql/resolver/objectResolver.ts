import { STATUS_CODE } from '@shared/db.receiver';
import { IResolvers } from 'graphql-tools';
import {
    getObjectList,
    getObjectListByBid,
} from 'src/database/service/object.service';

const objectResolver: IResolvers = {
    Query: {
        async objectList(): Promise<Array<object>> {
            const result = await getObjectList();
            if (result.status == STATUS_CODE.SUCCESS) return result.data;
            else throw new Error(result.err);
        },
        async objectListByBid(_: void, bid: number): Promise<Array<object>> {
            const result = await getObjectListByBid(bid);
            if (result.status == STATUS_CODE.SUCCESS) return result.data;
            else throw new Error(result.err);
        },
    },
};

export default objectResolver;
