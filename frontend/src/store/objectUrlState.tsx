import { atom } from 'recoil';

const objectUrlState = atom({
    key: 'objectUrlState',
    default: [
        {
            id: 0,
            url: '',
        },
    ],
});

export default objectUrlState;
