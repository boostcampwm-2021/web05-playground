import { atom } from 'recoil';

const userState = atom({
    key: 'userState',
    default: {
        uid: 1,
        nickname: 'minjae',
        email: 'minjaec023@gmail.com',
        x: 0,
        y: 0,
        imageUrl: '/assets/character1',
    },
});

export default userState;
