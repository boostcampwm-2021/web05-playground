import {
    addObject,
    getObjectListByBid,
} from '../database/service/object.service';
import { IObject } from '../database/entities/Object';
import { STATUS_CODE } from '@shared/db.receiver';
import { addObjectError, objectListError } from '@shared/constants';

export const getObjectInfo = async (bid: number): Promise<IObject[]> => {
    const ObjectInfo = await getObjectListByBid(bid);
    if (ObjectInfo.objectArr === undefined) throw new Error(objectListError);
    if (ObjectInfo.status === STATUS_CODE.FAIL)
        throw new Error(objectListError);
    return ObjectInfo.objectArr;
};

export const addObjectInfo = async (data: IObject): Promise<IObject> => {
    const addObjectInfo = await addObject(data);
    if (addObjectInfo.addedObject === undefined)
        throw new Error(addObjectError);
    if (addObjectInfo.status === STATUS_CODE.FAIL)
        throw new Error(addObjectError);
    return addObjectInfo.addedObject;
};
