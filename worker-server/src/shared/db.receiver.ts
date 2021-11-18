import { IBuilding } from 'src/database/entities/Building';
import { IObject } from 'src/database/entities/Object';
import { IUser } from 'src/database/entities/User';

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
