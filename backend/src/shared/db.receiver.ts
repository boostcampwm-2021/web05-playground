import { IObject } from 'src/database/entities/Object';
import { IUser } from 'src/database/entities/User';
import { IWorld } from 'src/database/entities/World';

export enum STATUS_CODE {
    SUCCESS = 1,
    FAIL,
}

export interface Receiver {
    status: STATUS_CODE;
    err?: string;
    objectArr?: Array<IObject>
    worldArr?: Array<IWorld>
    userArr?: Array<IUser>
    user?: IUser;
}