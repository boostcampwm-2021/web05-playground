import { STATUS_CODE } from '@shared/db.receiver';
import { IResolvers } from 'graphql-tools';
import { IUser } from '../../database/entities/User';
import { insertUser, setUser } from '../../database/service/user.service';
import axios from 'axios';

const userResolver: IResolvers = {
    Query: {},
    Mutation: {
        async setUserInfo(
            _: void,
            args: { id: number; nickname: string; imageUrl: string },
        ): Promise<IUser> {
            const result = await setUser(args.id, args.nickname, args.imageUrl);

            if (
                result.status == STATUS_CODE.SUCCESS &&
                result.user !== undefined
            )
                return result.user;
            else throw new Error(result.err);
        },

        async user(_: void, args: { code: string }): Promise<IUser> {
            const tokenURL = process.env.TOKEN_URL
                ? process.env.TOKEN_URL?.concat(args.code)
                : '';

            const { data } = await axios.post(tokenURL);

            const searchParams = new URLSearchParams(data);
            const accessToken = searchParams.get('access_token');

            const USER_PROFILE_URL = 'https://api.github.com/user';
            const { data: userInformation } = await axios.get(
                USER_PROFILE_URL,
                {
                    headers: {
                        Authorization: `token ${accessToken}`,
                    },
                },
            );
            const { id: userId, login: nickname, email } = userInformation;

            const result = await insertUser(userId, nickname, email);
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
