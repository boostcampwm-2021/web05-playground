import { STATUS_CODE } from '@shared/db.receiver';
import { IResolvers } from 'graphql-tools';
import { IUser } from 'src/database/entities/User';
import { insertUser, setUser } from 'src/database/service/user.service';
import axios from 'axios';

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

        async user(_: void, args: { code: string }): Promise<IUser> {
            const clientId = '2cc30cf9721c0fef25ed';
            const secret = '19e333403d70d77cca8dda1cddb4301a181052af';
            const TOKEN_URL = `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${secret}&code=${args.code}`;
            const { data } = await axios.post(TOKEN_URL);

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
