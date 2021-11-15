export interface IWorld {
    id: number;
    uid: number;
    name: string;
    port: number;
    thumbnail: string;
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

export interface IWorldInfo {
    buildings: IBuilding[];
    objects: IObject[];
}

export interface IProps {
    layers: ILayer[];
    buildingList: IBuilding[];
    objectList: IObject[];
}
