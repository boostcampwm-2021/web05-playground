import React from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import currentModalState from '../../../store/currentModalState';

const icons = [
    'voiceChat',
    'fileUpload',
    'buildBuilding',
    'buildObject',
    'users',
    'chat',
    'setting',
];

const Menu = () => {
    const [currentModal, setCurrentModal] = useRecoilState(currentModalState);

    const menuList = icons.map((icon) => {
        return (
            <Icons
                key={icon}
                src={`/assets/${icon}.png`}
                onClick={() => {
                    if (currentModal === icon) setCurrentModal('none');
                    else setCurrentModal(icon);
                }}
            />
        );
    });

    return <>{menuList}</>;
};

export default Menu;

const Icons = styled.img`
    width: 40px;
    height: 40px;
`;
