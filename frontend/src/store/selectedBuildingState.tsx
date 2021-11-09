import { atom } from 'recoil';

const selectedBuildingState = atom({
    key: 'selectedBuildingState',
    default: 'none',
});

export default selectedBuildingState;
