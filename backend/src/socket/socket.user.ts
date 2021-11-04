import { getUser } from '../database/service/user.service';
import { IUser } from '../database/entities/User';
import { STATUS_CODE } from '@shared/db.receiver';
import { userListError } from '@shared/constants';

export const getUserInfo = async (email: string): Promise<IUser> => {
    const userInfo = await getUser(email);
    if(userInfo.user === undefined) throw new Error(userListError);
    if(userInfo.status === STATUS_CODE.FAIL) throw new Error(userListError);
    return userInfo.user; 
}
export const addUser = (user: IUser, userList: Array<IUser>): void => {
    userList.push(user);
}

export const deleteUser = (uid: number, userList: Array<IUser>): Array<IUser> => {
    const newUserList = userList.filter((user) => user.id !== uid);
    return newUserList;
}