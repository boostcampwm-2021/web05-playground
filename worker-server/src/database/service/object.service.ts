import {
    addObjectError,
    objectListError,
    objectUrlError,
} from '@shared/constants';
import { Receiver, STATUS_CODE } from '@shared/db.receiver';
import { pool2 } from '../connection';
import { IObject } from '../entities/Object';

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

export const addObject = async (data: IObject): Promise<Receiver> => {
    const result: Receiver = {
        status: STATUS_CODE.SUCCESS,
    };

    try {
        const sql = `INSERT INTO object(id, bid, x, y, image_url, file_url) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [
            data.id,
            data.bid,
            data.x,
            data.y,
            data.imageUrl,
            data.fileUrl,
        ];

        const [ret] = await pool2.query(sql, values);
        const objectId = JSON.parse(JSON.stringify(ret)).insertId;
        result.addedObject = { ...data, id: objectId };
        return result;
    } catch (err) {
        console.log(err);
        result.status = STATUS_CODE.FAIL;
        result.err = addObjectError;
        return result;
    }
};
