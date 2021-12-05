import { STATUS_CODE } from '@shared/db.receiver';
import { IResolvers } from 'graphql-tools';
import { getObjectUrl } from '../../database/service/object.service';

const objectResolver: IResolvers = {
    Query: {
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
