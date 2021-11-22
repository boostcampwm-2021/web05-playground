import { atom } from 'recoil';

const buildingUrlState = atom({
    key: 'buildingUrlState',
    default: [
        {
            id: 0,
            url: '',
        },
    ],
});

export default buildingUrlState;
