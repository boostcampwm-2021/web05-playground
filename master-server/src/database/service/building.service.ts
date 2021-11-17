import { buildingUrlError } from '@shared/constants';
import { Receiver, STATUS_CODE } from '@shared/db.receiver';
import { pool } from '../connection';

export const getBuildingUrl = async (): Promise<Receiver> => {
    const result: Receiver = {
        status: STATUS_CODE.SUCCESS,
    };

    try {
        const sql = `SELECT id, url FROM building`;
        const [urls] = await pool.query(sql);

        result.buildingUrl = JSON.parse(JSON.stringify(urls));
        return result;
    } catch (err) {
        result.status = STATUS_CODE.FAIL;
        result.err = buildingUrlError;
        return result;
    }
};
