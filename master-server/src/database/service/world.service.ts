import { worldListError } from '@shared/constants';
import { Receiver, STATUS_CODE } from '@shared/db.receiver';
import { pool } from '../connection';
import { IWorld } from '../entities/World';

export const getWorldList = async (): Promise<Receiver> => {
    const result: Receiver = {
        status: STATUS_CODE.SUCCESS,
    };

    try {
        const sql = `SELECT * FROM world`;
        const [worlds] = await pool.query(sql);
        const data: IWorld[] = JSON.parse(JSON.stringify(worlds));
        result.worldArr = data;
        return result;
    } catch (err) {
        result.status = STATUS_CODE.FAIL;
        result.err = worldListError;
        return result;
    }
};

export const getMaxWorldPort = async (): Promise<Receiver> => {
    const result: Receiver = {
        status: STATUS_CODE.SUCCESS,
    };

    try {
        const sql = `SELECT Max(port) FROM world`;
        const [worlds] = await pool.query(sql);
        const data: number = JSON.parse(JSON.stringify(worlds))[0]['Max(port)'];
        result.maxWorldPort = data;
        return result;
    } catch (err) {
        result.status = STATUS_CODE.FAIL;
        result.err = worldListError;
        return result;
    }
};

export const addWorld = async (
    uid: number,
    name: string,
    port: number,
    thumbnail: string,
): Promise<Receiver> => {
    const result: Receiver = {
        status: STATUS_CODE.SUCCESS,
    };
    try {
        const sql = `INSERT INTO world VALUES(null, ?, ?, ?, ?)`;
        await pool.query(sql, [uid, name, port, thumbnail]);
        return result;
    } catch (err) {
        result.status = STATUS_CODE.FAIL;
        result.err = worldListError;
        return result;
    }
};
