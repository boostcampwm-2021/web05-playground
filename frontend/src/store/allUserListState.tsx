import { atom } from 'recoil';
import { UserMap } from '../utils/model';

const allUserListState = atom<UserMap>({
    key: 'allUserListState',
    default: {},
});

export default allUserListState;
