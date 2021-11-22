import { addUserError, setUserError, userListError } from '@shared/constants';
import { Receiver, STATUS_CODE } from '@shared/db.receiver';
import { pool2 } from '../connection';
import { IUser } from '../entities/User';

export const getUser = async (id: number): Promise<Receiver> => {
    console.log(id);
    const result: Receiver = {
        status: STATUS_CODE.SUCCESS,
    };
    try {
        const sql = `SELECT id, email, nickname, x, y, image_url as imageUrl FROM world_user WHERE id = ?`;
        const [user] = await pool2.query(sql, [id]);
        const data = JSON.parse(JSON.stringify(user));

        if (data.length === 0) {
            result.status = STATUS_CODE.FAIL;
            return result;
        }

        result.user = JSON.parse(JSON.stringify(user))[0];
        return result;
    } catch (err) {
        console.log(err);
        result.status = STATUS_CODE.FAIL;
        result.err = userListError;
        return result;
    }
};

export const addUser = async (user: IUser): Promise<Receiver> => {
    const result: Receiver = {
        status: STATUS_CODE.SUCCESS,
    };

    try {
        const sql = `INSERT INTO world_user VALUES(?, ?, ?, ?, ?, ?)`;
        await pool2.query(sql, [
            user.id,
            user.email,
            user.nickname,
            0,
            0,
            user.imageUrl,
        ]);
        return result;
    } catch (err) {
        console.log(err);
        result.status = STATUS_CODE.FAIL;
        result.err = addUserError;
        return result;
    }
};

export const setEnterUser = async (user: IUser): Promise<Receiver> => {
    const result: Receiver = {
        status: STATUS_CODE.SUCCESS,
    };
    try {
        const sql = `INSERT INTO world_user VALUES(?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE nickname = ?, image_url= ?`;
        await pool2.query(sql, [
            user.id,
            user.email,
            user.nickname,
            0,
            0,
            user.imageUrl,
            user.nickname,
            user.imageUrl,
        ]);
        result.user = user;
        return result;
    } catch (err) {
        console.log(err);
        result.status = STATUS_CODE.FAIL;
        result.err = setUserError;
        return result;
    }
};

export const setExitUser = async (user: IUser): Promise<Receiver> => {
    const result: Receiver = {
        status: STATUS_CODE.SUCCESS,
    };
    try {
        const sql = `UPDATE world_user SET x = ?, y = ? WHERE id = ?`;
        console.log('setUSesr');
        console.log(user);
        await pool2.query(sql, [user.x, user.y, user.id]);
        result.user = user;
        return result;
    } catch (err) {
        console.log(err);
        result.status = STATUS_CODE.FAIL;
        result.err = setUserError;
        return result;
    }
};
