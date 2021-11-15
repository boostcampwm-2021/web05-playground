import { objectListError, objectUrlError } from '@shared/constants';
import { Receiver, STATUS_CODE } from '@shared/db.receiver';
import { pool1, pool2 } from '../connection';

export const getObjectList = async (): Promise<Receiver> => {
    const result: Receiver = {
        status: STATUS_CODE.SUCCESS,
    };

    try {
        const sql = `SELECT id, bid, x, y, image_url as imageUrl, file_url as fileUrl FROM object`;
        const [objects] = await pool2.query(sql);

        result.objectArr = JSON.parse(JSON.stringify(objects));
        return result;
    } catch (err) {
        result.status = STATUS_CODE.FAIL;
        result.err = objectListError;
        return result;
    }
};

export const getObjectListByBid = async (bid: number): Promise<Receiver> => {
    const result: Receiver = {
        status: STATUS_CODE.SUCCESS,
    };
    try {
        const sql = `SELECT id, bid, x, y, image_url as imageUrl, file_url as fileUrl FROM object WHERE bid= ?`;
        const [objects] = await pool2.query(sql, [bid]);

        result.objectArr = JSON.parse(JSON.stringify(objects));
        return result;
    } catch (err) {
        result.status = STATUS_CODE.FAIL;
        result.err = objectListError;
        return result;
    }
};

export const getObjectUrl = async (): Promise<Receiver> => {
    const result: Receiver = {
        status: STATUS_CODE.SUCCESS,
    };

    try {
        const sql = `SELECT id, url FROM object`;
        const [urls] = await pool1.query(sql);

        result.objectUrl = JSON.parse(JSON.stringify(urls));
        return result;
    } catch (err) {
        result.status = STATUS_CODE.FAIL;
        result.err = objectUrlError;
        return result;
    }
};
