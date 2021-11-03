import { pool } from '../connection';
import { IObject } from '../entities/Object';

export const getObjectList = async (): Promise<Array<IObject>> => {
    const sql = `SELECT * FROM Object`;

    const [objects] = await pool.query(sql);
    const parsedObject = JSON.parse(JSON.stringify(objects));

    const results: Array<IObject> = parsedObject.map((_object: IObject) => {
        return _object;
    });
    return results;
};

export const getObjectListByBid = async (
    bid: number,
): Promise<Array<IObject>> => {
    const sql = `SELECT * FROM Object WHERE bid=${bid}`;

    const [objects] = await pool.query(sql);
    const parsedObject = JSON.parse(JSON.stringify(objects));

    const results: Array<IObject> = parsedObject.map((_object: IObject) => {
        return _object;
    });
    return results;
};
