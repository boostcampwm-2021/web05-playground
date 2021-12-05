import { IBuilding } from '../database/entities/Building';
import { IObject } from '../database/entities/Object';
import { IUser } from '../database/entities/User';

export enum STATUS_CODE {
    SUCCESS = 1,
    FAIL,
}

export interface Receiver {
    status: STATUS_CODE;
    err?: string;
    objectArr?: Array<IObject>;
    addedObject?: IObject;
    buildingArr?: Array<IBuilding>;
    addedBuilding?: IBuilding;
    userArr?: Array<IUser>;
    user?: IUser;
}
