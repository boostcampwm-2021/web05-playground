import { getBuildingList } from '../database/service/building.service';
import { IBuilding } from '../database/entities/Building';
import { STATUS_CODE } from '@shared/db.receiver';
import { buildingListError } from '@shared/constants';

export const getBuildinginfo = async (): Promise<IBuilding[]> => {
    const BuildingInfo = await getBuildingList();
    if (BuildingInfo.buildingArr === undefined)
        throw new Error(buildingListError);
    if (BuildingInfo.status === STATUS_CODE.FAIL)
        throw new Error(buildingListError);
    return BuildingInfo.buildingArr;
};
