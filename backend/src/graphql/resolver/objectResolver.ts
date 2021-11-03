import { IResolvers } from 'graphql-tools';
import { IObject } from 'src/database/entities/Object';
import {
    getObjectList,
    getObjectListByBid,
} from 'src/database/service/object.service';

const objectResolver: IResolvers = {
    Query: {
        async objectList(): Promise<Array<IObject>> {
            return await getObjectList();
        },
        //async objectListByBid(_: void, { bid }): Promise<Array<IObject>> {
        //    return await getObjectListByBid(bid);
        //},
    },
};

export default objectResolver;
