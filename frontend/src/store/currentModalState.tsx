import { atom } from 'recoil';

const currentModalState = atom({
    key: 'currenModalState',
    default: 'none',
});

export default currentModalState;
