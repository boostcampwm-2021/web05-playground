import { STATUS_CODE } from '@shared/db.receiver';
import { IResolvers } from 'graphql-tools';
import { IUser } from 'src/database/entities/User';
import { setUser } from 'src/database/service/user.service';

const userResolver: IResolvers = {
    Query: {},
    Mutation: {
        async setUserInfo(
            _: void,
            args: { id: number; nickname: string; imageUrl: string },
        ): Promise<IUser> {
            console.log(args);
            const result = await setUser(args.id, args.nickname, args.imageUrl);

            if (
                result.status == STATUS_CODE.SUCCESS &&
                result.user !== undefined
            )
                return result.user;
            else throw new Error(result.err);
        },
    },
};

export default userResolver;
