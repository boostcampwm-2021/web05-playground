import { addUser2, getUser2, setUser2 } from '../database/service/user.service';
import { IUser } from '../database/entities/User';
import { STATUS_CODE } from '@shared/db.receiver';
import { userListError } from '@shared/constants';

interface UserMap {
    [key: number]: IUser;
}

export const isExistUserInfo = async (id: number): Promise<boolean> => {
    const userInfo = await getUser2(id);
    if (userInfo.status === STATUS_CODE.FAIL) return false;
    return true;
};

export const getUserInfo = async (id: number): Promise<IUser> => {
    const userInfo = await getUser2(id);
    if (userInfo.user === undefined) throw new Error(userListError);
    if (userInfo.status === STATUS_CODE.FAIL) throw new Error(userListError);
    return userInfo.user;
};
export const addUserInfo = async (user: IUser, userMap: UserMap) => {
    if (!(await isExistUserInfo(user.id))) await addUser2(user);
    else await setUser2(user);

    const userInfo = await getUserInfo(user.id);
    userMap[user.id] = userInfo;
};

export const deleteUserInfo = async (id: number, userMap: UserMap) => {
    console.log('delete');
    console.log(userMap[id]);
    await setUser2(userMap[id]);
    delete userMap[id];
};

export const moveUserInfo = (user: IUser, userMap: UserMap) => {
    userMap[user.id] = user;
};
