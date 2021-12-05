import { STATUS_CODE } from '@shared/db.receiver';
import { IResolvers } from 'graphql-tools';
import { getBuildingUrl } from '../../database/service/building.service';

const buildingResolver: IResolvers = {
    Query: {
        async buildingUrl(): Promise<Array<object>> {
            const result = await getBuildingUrl();
            if (
                result.status == STATUS_CODE.SUCCESS &&
                result.buildingUrl !== undefined
            )
                return result.buildingUrl;
            else throw new Error(result.err);
        },
    },
};

export default buildingResolver;
