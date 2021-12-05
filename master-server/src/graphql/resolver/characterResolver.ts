import { STATUS_CODE } from '@shared/db.receiver';
import { IResolvers } from 'graphql-tools';
import { getCharacterList } from '../../database/service/character.service';

const characterResolver: IResolvers = {
    Query: {
        async characterList(): Promise<Array<object>> {
            const result = await getCharacterList();
            if (
                result.status == STATUS_CODE.SUCCESS &&
                result.characterArr !== undefined
            )
                return result.characterArr;
            else throw new Error(result.err);
        },
    },
};

export default characterResolver;
