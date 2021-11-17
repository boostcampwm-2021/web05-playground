export interface ICharacter {
    id: number;
    imageUrl: string;
}

export class Character implements ICharacter {
    public id: number;
    public imageUrl: string;

    constructor(id: number, imageUrl: string) {
        this.id = id;
        this.imageUrl = imageUrl;
    }
}
