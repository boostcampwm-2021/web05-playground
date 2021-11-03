import { getUser } from '../database/service/user.service';
import { IUser } from '../database/entities/User';

export const getUserInfo = async (email: string): Promise<IUser> => {
    const userInfo = await getUser(email);
    return userInfo;
}

export const addUser = (user: IUser, userList: Array<IUser>): void => {
    userList.push(user);
}

export const deleteUser = (email: string, userList: Array<IUser>): Array<IUser> => {
    const newUserList = userList.filter((user) => user.email !== email);
    return newUserList;
}