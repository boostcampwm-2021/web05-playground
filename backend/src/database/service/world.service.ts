import { pool } from '../connection';
import { IWorld } from '../entities/World';

export const getWorldList = async (): Promise<Array<IWorld>> => {
    const sql = `SELECT * FROM World`;

    const [worlds] = await pool.query(sql);
    const parsedWorld = JSON.parse(JSON.stringify(worlds));

    const results: Array<IWorld> = parsedWorld.map((world: IWorld) => {
        return world;
    });
    return results;
};
