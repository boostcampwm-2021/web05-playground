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
