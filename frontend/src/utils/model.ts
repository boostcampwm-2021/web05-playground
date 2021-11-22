export interface IUser {
    id: number;
    email: string;
    nickname: string;
    x?: number;
    y?: number;
    imageUrl: string;
}

export interface UserMap {
    [key: string]: IUser;
}

export interface IWorld {
    id: number;
    uid: number;
    name: string;
    port: number;
    thumbnail: string;
}

export interface ICharacter {
    id: number;
    imageUrl: string;
}

interface ILayer {
    data: number[];
    height: number;
    width: number;
    imgSrc: string;
    columnCount: number;
}

export interface IBuilding {
    id: number;
    x: number;
    y: number;
    uid: number;
    description: string;
    scope: string;
    password: string;
    imageUrl: string;
}

export interface IObject {
    id: number;
    bid: number;
    x: number;
    y: number;
    imageUrl: string;
    fileUrl: string;
}

export interface IBuildingInfo {
    buildings: IBuilding[];
    objects: IObject[];
}

export interface IProps {
    layers: ILayer[];
    buildingList: IBuilding[];
    objectList: IObject[];
    current: number;
}

export interface MessageInfo {
    id: string;
    message: string;
}

export interface MessageInfos {
    messageInfos: MessageInfo[];
}

export interface ActiveModal {
    active: boolean;
}

export interface ModalToggle {
    modalToggle: boolean;
}
