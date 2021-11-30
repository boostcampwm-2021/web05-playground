import {
    addBuilding,
    getBuildingList,
    addFirstBuilding,
} from '../database/service/building.service';
import { IBuilding } from '../database/entities/Building';
import { STATUS_CODE } from '@shared/db.receiver';
import { addBuildingError, buildingListError } from '@shared/constants';

export const getBuildingInfo = async (): Promise<IBuilding[]> => {
    const BuildingInfo = await getBuildingList();
    if (BuildingInfo.buildingArr === undefined)
        throw new Error(buildingListError);
    if (BuildingInfo.status === STATUS_CODE.FAIL)
        throw new Error(buildingListError);
    return BuildingInfo.buildingArr;
};

export const addBuildingInfo = async (data: IBuilding): Promise<IBuilding> => {
    const addBuilingInfo = await addBuilding(data);
    if (addBuilingInfo.addedBuilding === undefined)
        throw new Error(addBuildingError);
    if (addBuilingInfo.status === STATUS_CODE.FAIL)
        throw new Error(addBuildingError);
    return addBuilingInfo.addedBuilding;
};

export const addFirstBuildingInfo = async () => {
    const addFirstBuilingInfo = await addFirstBuilding();
    if (addFirstBuilingInfo.addedBuilding === undefined)
        throw new Error(addBuildingError);
    if (addFirstBuilingInfo.status === STATUS_CODE.FAIL)
        throw new Error(addBuildingError);
};
