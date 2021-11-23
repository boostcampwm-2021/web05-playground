/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { socketClient } from '../../socket/socket';

import buildObjectState from '../../store/buildObjectState';
import { DEFAULT_INDEX, NONE } from '../../utils/constants';

import { uploadFiles } from '../../utils/query';

const setBuildingModal = () => {
    const [buildObject, setBuildObject] = useRecoilState(buildObjectState);
    const [file, setFile] = useState<File>();
    const [uploadFile] = useMutation(uploadFiles, {
        onCompleted: (data) => {
            socketClient.emit('buildObject', {
                x: buildObject.locationX,
                y: buildObject.locationY,
                bid: buildObject.roomId,
                imageUrl: buildObject.src,
                fileUrl: data.url,
            });
        },
    });

    const cancleBuild = () => {
        const selectedObjectInfo = {
            src: 'none',
            id: NONE,
            roomId: NONE,
            locationX: NONE,
            locationY: NONE,
            isLocated: false,
            isData: false,
        };
        setBuildObject(selectedObjectInfo);
    };

    const completeBuild = () => {
        const objectInfo = {
            x: buildObject.locationX,
            y: buildObject.locationY,
            bid: buildObject.roomId,
            imageUrl: buildObject.src,
            fileUrl: '',
        };

        if (file === undefined) socketClient.emit('buildObject', objectInfo);
        else {
            console.log({ file, name: file.name, mimeType: file.type, bid: buildObject.roomId });
            // uploadFile({
            //     variables: { file, name: file.name, mimeType: file.type, bid: buildObject.roomId },
            // });
        }

        const selectedObjectInfo = {
            src: 'none',
            id: NONE,
            roomId: NONE,
            locationX: NONE,
            locationY: NONE,
            isLocated: false,
            isData: false,
        };
        setBuildObject(selectedObjectInfo);
        alert('추가되었습니다.');
    };

    const makeFileList = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        if (target.files === null) return;
        setFile(target.files[DEFAULT_INDEX]);
    };

    return (
        <ModalDiv>
            <BtnWrapper>
                <StyledBtn onClick={cancleBuild}>취소</StyledBtn>
                <StyledInput
                    id="uploadFile"
                    type="file"
                    accept=".doc,.docx,.pdf,image/*"
                    onChange={makeFileList}
                />
                <StyledBtn>
                    <label htmlFor="uploadFile">업로드</label>
                </StyledBtn>
                <StyledBtn onClick={completeBuild}>확인</StyledBtn>
            </BtnWrapper>
        </ModalDiv>
    );
};

export default setBuildingModal;

const ModalDiv = styled.div`
    position: absolute;
    z-index: 3;

    top: 50%;
    left: 50%;
    width: 400px;
    height: 400px;
    background: #c4c4c4;
    margin: -240px 0 0 -200px;

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    border-radius: 20px;
    border: 3px solid black;
`;

const BtnWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 300px;
`;

const StyledBtn = styled.button`
    height: 40px;
    width: 70px;
    background-color: #c4c4c4c4;
    border-radius: 20px;
`;

const StyledInput = styled.input`
    display: none;
`;
