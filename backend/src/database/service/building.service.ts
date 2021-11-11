import { buildingListError } from '@shared/constants';
import { Receiver, STATUS_CODE } from '@shared/db.receiver';
import { pool2 } from '../connection';

export const getBuildingList = async (): Promise<Receiver> => {
    const result: Receiver = {
        status: STATUS_CODE.SUCCESS,
    };

    try {
        const sql = `SELECT id, x, y, uid, description, scope, password, image_url as imageUrl FROM building`;
        const [buildings] = await pool2.query(sql);

        result.buildingArr = JSON.parse(JSON.stringify(buildings));
        return result;
    } catch (err) {
        result.status = STATUS_CODE.FAIL;
        result.err = buildingListError;
        return result;
    }
};
