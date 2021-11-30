import { atom } from 'recoil';
import { IUser } from '../utils/model';

const userState = atom<IUser>({
    key: 'userState',
    default: {
        id: 1,
        nickname: 'minjae',
        email: 'minjaec023@gmail.com',
        x: 10,
        y: 10,
        imageUrl: '/assets/character1.png',
        isInBuilding: -1,
    },
});

export default userState;
