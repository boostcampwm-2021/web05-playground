import { IObject } from 'src/database/entities/Object';
import { IWorld } from 'src/database/entities/World';

export enum STATUS_CODE {
    SUCCESS = 1,
    FAIL,
}

export interface Receiver {
    status: STATUS_CODE;
    err?: string;
    data: Array<IObject> | Array<IWorld>;
}
