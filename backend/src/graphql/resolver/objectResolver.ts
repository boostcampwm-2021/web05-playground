import { STATUS_CODE } from '@shared/db.receiver';
import { IResolvers } from 'graphql-tools';
import {
    getObjectListByBid,
    getObjectUrl,
} from 'src/database/service/object.service';

const objectResolver: IResolvers = {
    Query: {
        /*async objectList(): Promise<Array<object>> {
            const result = await getObjectList();
            if (
                result.status == STATUS_CODE.SUCCESS &&
                result.objectArr !== undefined
            )
                return result.objectArr;
            else throw new Error(result.err);
        },
        async objectListByBid(_: void, bid: number): Promise<Array<object>> {
            const result = await getObjectListByBid(bid);
            if (
                result.status == STATUS_CODE.SUCCESS &&
                result.objectArr !== undefined
            )
                return result.objectArr;
            else throw new Error(result.err);
        },*/
        async objectUrl(): Promise<Array<object>> {
            const result = await getObjectUrl();
            if (
                result.status == STATUS_CODE.SUCCESS &&
                result.objectUrl !== undefined
            )
                return result.objectUrl;
            else throw new Error(result.err);
        },
    },
};

export default objectResolver;
