import {
    buildingListError,
    addBuildingError,
    buildingUrlError,
} from '@shared/constants';
import { Receiver, STATUS_CODE } from '@shared/db.receiver';
import { pool2 } from '../connection';
import { IBuilding } from '../entities/Building';

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

export const addBuilding = async (data: IBuilding): Promise<Receiver> => {
    const result: Receiver = {
        status: STATUS_CODE.SUCCESS,
    };

    try {
        const sql = `INSERT INTO building(x, y, uid, description, scope, password, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            data.x,
            data.y,
            data.uid,
            data.description,
            data.scope,
            data.password,
            data.imageUrl,
        ];
        const [ret] = await pool2.query(sql, values);
        const buildingId = JSON.parse(JSON.stringify(ret)).insertId;
        result.addedBuilding = { ...data, id: buildingId };
        return result;
    } catch (err) {
        console.log(err);
        result.status = STATUS_CODE.FAIL;
        result.err = addBuildingError;
        return result;
    }
};

export const addFirstBuilding = async (): Promise<Receiver> => {
    const result: Receiver = {
        status: STATUS_CODE.SUCCESS,
    };

    try {
        const sql = `INSERT INTO building(id, x, y, uid, description, scope, password, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [1, -1000, -1000, -1, 'world', 'public', '', ''];
        await pool2.query(sql, values);
        result.addedBuilding = {
            id: 1,
            x: -1000,
            y: -1000,
            uid: -1,
            description: 'world',
            scope: 'public',
            password: '',
            imageUrl: '',
        };
        return result;
    } catch (err) {
        console.log(err);
        result.status = STATUS_CODE.FAIL;
        result.err = addBuildingError;
        return result;
    }
};
