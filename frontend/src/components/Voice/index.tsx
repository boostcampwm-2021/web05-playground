import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { socketClient } from '../../socket/socket';

let myStream: any;
let myPeerConnection: any;
const serverUrls = {
    iceServers: [
        {
            urls: ['stun:stun.l.google.com:19302'],
        },
    ],
};

const Voice = () => {
    const videoRef = useRef<any>();
    const othersVideoRef = useRef<any>();

    useEffect(() => {
        const init = async () => {
            await initCall();
            socketClient.emit('join_room');
            socketClient.on('welcome', async () => {
                const offer = await myPeerConnection.createOffer();
                myPeerConnection.setLocalDescription(offer);
                socketClient.emit('offer', offer);
            });

            socketClient.on('offer', async (offer) => {
                myPeerConnection.setRemoteDescription(offer);
                const answer = await myPeerConnection.createAnswer();
                myPeerConnection.setLocalDescription(answer);
                socketClient.emit('answer', answer);
            });

            socketClient.on('answer', (answer) => {
                myPeerConnection.setRemoteDescription(answer);
            });

            socketClient.on('ice', (ice) => {
                myPeerConnection.addIceCandidate(ice);
            });
        };

        // makeConnection는 한번만 실행되야함!!
        if (socketClient !== undefined) {
            init();
        }

        return () => {
            socketClient.removeListener('welcome');
            socketClient.removeListener('offer');
            socketClient.removeListener('answer');
            socketClient.removeListener('ice');
        };
    }, [socketClient, myPeerConnection]);

    const getMedia = async (deviceId?: any) => {
        const initialConstrains = {
            audio: true,
            video: true,
        };
        const cameraConstraints = {
            audio: true,
            video: { deviceId: { exact: deviceId } },
        };
        try {
            myStream = await navigator.mediaDevices.getUserMedia(
                deviceId ? cameraConstraints : initialConstrains,
            );

            if (videoRef.current === undefined) return;
            videoRef.current.srcObject = myStream;
        } catch (e) {
            console.log(e);
        }
    };

    function handleIce(data: any) {
        socketClient.emit('ice', data.candidate);
    }

    function handleAddStream(data: any) {
        if (othersVideoRef.current === undefined) return;
        othersVideoRef.current.srcObject = data.stream;
    }

    const makeConnection = () => {
        myPeerConnection = new RTCPeerConnection(serverUrls);
        myPeerConnection.addEventListener('icecandidate', handleIce);
        myPeerConnection.addEventListener('addstream', handleAddStream);
        myStream.getTracks().forEach((track: any) => myPeerConnection.addTrack(track, myStream));
    };

    const initCall = async () => {
        await getMedia();
        makeConnection();
    };

    return (
        <>
            <MyVideo ref={videoRef} muted autoPlay />
            <MyVideo ref={othersVideoRef} muted autoPlay />
        </>
    );
};

export default Voice;

export const MyVideo = styled.video`
    position: relative;
    z-index: 101;
    width: 140px;
    height: 100px;
    border: 2px solid #cedd7c;
    border-radius: 16px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;
