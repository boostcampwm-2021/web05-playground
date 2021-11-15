import { getUser } from '../database/service/user.service';
import { IUser } from '../database/entities/User';
import { STATUS_CODE } from '@shared/db.receiver';
import { userListError } from '@shared/constants';

export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}
interface UserMap {
    [key: number]: IUser;
}

export interface UserMove {
    id: number;
    email: string;
    direction: Direction;
}

export const getUserInfo = async (id: number): Promise<IUser> => {
    const userInfo = await getUser(id);
    if (userInfo.user === undefined) throw new Error(userListError);
    if (userInfo.status === STATUS_CODE.FAIL) throw new Error(userListError);
    return userInfo.user;
};
export const addUser = (user: IUser, userMap: UserMap): void => {
    userMap[user.id] = user;
};

export const deleteUser = (uid: number, userMap: UserMap) => {
    delete userMap[uid];
};

export const moveUser = (data: IUser, userMap: UserMap) => {
    userMap[data.id] = data;
};
