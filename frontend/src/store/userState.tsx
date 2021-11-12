import { atom } from 'recoil';

const userState = atom({
    key: 'userState',
    default: {
        id: 1,
        nickname: 'minjae',
        email: 'minjaec023@gmail.com',
        x: 10,
        y: 10,
        imageUrl: '/assets/character1',
    },
});

export default userState;
