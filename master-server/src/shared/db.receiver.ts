import { IBuilding } from '../database/entities/Building';
import { IObject } from '../database/entities/Object';
import { IUser } from '../database/entities/User';
import { IWorld } from '../database/entities/World';
import { IUrl } from '../database/entities/Url';
import { ICharacter } from '../database/entities/Character';

export enum STATUS_CODE {
    SUCCESS = 1,
    FAIL,
}

export interface Receiver {
    status: STATUS_CODE;
    err?: string;
    objectUrl?: Array<IUrl>;
    objectArr?: Array<IObject>;
    addedObject?: IObject;
    buildingUrl?: Array<IUrl>;
    buildingArr?: Array<IBuilding>;
    characterArr?: Array<ICharacter>;
    addedBuilding?: IBuilding;
    worldArr?: Array<IWorld>;
    userArr?: Array<IUser>;
    user?: IUser;
    maxWorldPort?: number;
}
