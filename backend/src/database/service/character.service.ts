import { characterError } from '@shared/constants';
import { Receiver, STATUS_CODE } from '@shared/db.receiver';
import { pool1 } from '../connection';

export const getCharacterList = async (): Promise<Receiver> => {
    const result: Receiver = {
        status: STATUS_CODE.SUCCESS,
    };

    try {
        const sql = 'SELECT id, image_url as imageUrl FROM `character`';
        const [charaters] = await pool1.query(sql);

        result.characterArr = JSON.parse(JSON.stringify(charaters));
        return result;
    } catch (err) {
        result.status = STATUS_CODE.FAIL;
        result.err = characterError;
        return result;
    }
};
