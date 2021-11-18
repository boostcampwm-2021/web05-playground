import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';

import currentModalState from '../../../store/currentModalState';
import deviceState from '../../../store/deviceState';
import isInBuildingState from '../../../store/isInBuildingState';

const icons = ['fileUpload', 'buildBuilding', 'buildObject', 'users', 'chat', 'setting'];

const Menu = () => {
    const [currentModal, setCurrentModal] = useRecoilState(currentModalState);
    const [device, setDevice] = useRecoilState(deviceState);
    const isInBuilding = useRecoilValue(isInBuildingState);

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

    return (
        <>
            {isInBuilding !== -1 ? (
                <Icons
                    key="voiceChat"
                    src={
                        device.video === true ? '/assets/voiceChat.png' : '/assets/voiceChatOff.png'
                    }
                    onClick={() => {
                        setDevice({ ...device, video: !device.video, voice: !device.voice });
                    }}
                />
            ) : null}
            {menuList}
        </>
    );
};

export default Menu;

const Icons = styled.img`
    width: 40px;
    height: 40px;
`;
