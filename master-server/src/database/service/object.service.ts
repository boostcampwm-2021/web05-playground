import { objectUrlError } from '@shared/constants';
import { Receiver, STATUS_CODE } from '@shared/db.receiver';
import { pool } from '../connection';

export const getObjectUrl = async (): Promise<Receiver> => {
    const result: Receiver = {
        status: STATUS_CODE.SUCCESS,
    };

    try {
        const sql = `SELECT id, url FROM object`;
        const [urls] = await pool.query(sql);

        result.objectUrl = JSON.parse(JSON.stringify(urls));
        return result;
    } catch (err) {
        result.status = STATUS_CODE.FAIL;
        result.err = objectUrlError;
        return result;
    }
};
