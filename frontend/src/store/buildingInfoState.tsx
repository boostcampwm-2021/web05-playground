import { atom } from 'recoil';

const buildingInfoState = atom({
    key: 'buildingInfoState',
    default: {
        isBuilding: false,
        id: 0,
        x: -1,
        y: -1,
        uid: -1,
        description: '',
        scope: '',
        password: '',
        imageUrl: '',
    }
});

export default buildingInfoState;
