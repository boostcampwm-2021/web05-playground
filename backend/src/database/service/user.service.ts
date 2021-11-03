import { pool } from '../connection';
import { IUser } from '../entities/User';

export const getUser = async (email: string): Promise<IUser> => {
    const sql = `SELECT * FROM User WHERE email = ?`;

    const [user] = await pool.query(sql, [email]);
    const parsedUser = JSON.parse(JSON.stringify(user))[0];

    return parsedUser;
};