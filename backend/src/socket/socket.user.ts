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

export interface UserMove {
    id: number;
    email: string;
    direction: Direction;
}

export const getUserInfo = async (email: string): Promise<IUser> => {
    const userInfo = await getUser(email);
    if (userInfo.user === undefined) throw new Error(userListError);
    if (userInfo.status === STATUS_CODE.FAIL) throw new Error(userListError);
    return userInfo.user;
};

export const addUser = (user: IUser, userMap: Map<number, IUser>): void => {
    userMap.set(user.id, user);
};

export const deleteUser = (uid: number, userMap: Map<number, IUser>) => {
    userMap.delete(uid);
};

export const moveUser = (data: UserMove, userMap: Map<number, IUser>) => {
    const userInfo = userMap.get(data.id);
    if (userInfo === undefined) throw new Error(userListError);

    switch (data.direction) {
        case Direction.UP:
            userInfo.y += 1;
            break;
        case Direction.DOWN:
            userInfo.y -= 1;
            break;
        case Direction.LEFT:
            userInfo.x -= 1;
            break;
        case Direction.RIGHT:
            userInfo.x += 1;
            break;
    }
};
