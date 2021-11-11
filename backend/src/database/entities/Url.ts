export interface IUrl {
    id: number;
    url: string;
}

export class Url implements IUrl {
    public id: number;
    public url: string;

    constructor(id: number, url: string) {
        this.id = id;
        this.url = url;
    }
}
