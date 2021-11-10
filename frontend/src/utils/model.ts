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
    id?: number;
    x: number;
    y: number;
    uid?: number;
    description?: string;
    scope?: string;
    password?: string;
    url: string;
}

export interface IProps {
    layers: ILayer[];
    buildingList: IBuilding[];
}
