import { setUserError, userListError } from '@shared/constants';
import { Receiver, STATUS_CODE } from '@shared/db.receiver';
import { pool } from '../connection';

export const getUser = async (id: number): Promise<Receiver> => {
    const result: Receiver = {
        status: STATUS_CODE.SUCCESS,
    };
    try {
        const sql = `SELECT id, email, nickname, image_url as imageUrl FROM user WHERE id = ?`;
        const [user] = await pool.query(sql, [id]);
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

export const setUser = async (
    id: number,
    nickname: string,
    imageUrl: string,
): Promise<Receiver> => {
    const result: Receiver = {
        status: STATUS_CODE.SUCCESS,
    };
    try {
        const sql = `UPDATE user SET nickname = ?, image_url = ? WHERE id = ?`;
        await pool.query(sql, [nickname, imageUrl, id]);
        return await getUser(id);
    } catch (err) {
        console.log(err);
        result.status = STATUS_CODE.FAIL;
        result.err = setUserError;
        return result;
    }
};
