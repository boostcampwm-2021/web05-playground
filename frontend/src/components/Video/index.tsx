/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable consistent-return */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { socketClient } from '../../socket/socket';
import OtherVideo from './otherVideo';
import deviceState from '../../store/deviceState';

let myStream: MediaStream;
const serverUrls = {
    iceServers: [
        {
            urls: ['stun:stun.l.google.com:19302'],
        },
    ],
};

interface IUserInRoom {
    id: string;
    stream: MediaStream;
}

const Video = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const pcsRef = useRef<{ [socketId: string]: RTCPeerConnection }>({});
    const [users, setUsers] = useState<IUserInRoom[]>([]);
    const device = useRecoilValue(deviceState);

    const getMedia = useCallback(async () => {
        const initialConstrains = {
            audio: true,
            video: {
                width: 140,
                height: 100,
            },
        };
        try {
            myStream = await navigator.mediaDevices.getUserMedia(initialConstrains);

            console.log('asdf');
            if (videoRef.current === undefined || videoRef.current === null) return;
            console.log('asdf212');
            videoRef.current.srcObject = myStream;
        } catch (e) {
            console.log(e);
        }
    }, []);

    const createPeerConnection = useCallback((socketID: string) => {
        try {
            const pc = new RTCPeerConnection(serverUrls);

            pc.onicecandidate = (e) => {
                if (!(socketClient && e.candidate)) return;
                socketClient.emit('candidate', {
                    candidate: e.candidate,
                    candidateSendID: socketClient.id,
                    candidateReceiveID: socketID,
                });
            };

            pc.oniceconnectionstatechange = (e) => {
                console.log(e);
            };

            pc.ontrack = (e) => {
                setUsers((prevUsers) =>
                    prevUsers
                        .filter((user) => user.id !== socketID)
                        .concat({
                            id: socketID,
                            stream: e.streams[0],
                        }),
                );
            };

            if (myStream) {
                myStream.getTracks().forEach((track: MediaStreamTrack) => {
                    if (!myStream) return;
                    pc.addTrack(track, myStream);
                });
            } else {
                console.log('no local stream');
            }

            return pc;
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            socketClient.on('others', (others) => {
                getMedia();
                others.forEach(async (otherSocketId: string) => {
                    await getMedia();
                    if (otherSocketId === socketClient.id) return;
                    if (!myStream) return;
                    const pc = createPeerConnection(otherSocketId);
                    if (!(pc && socketClient)) return;
                    pcsRef.current = { ...pcsRef.current, [otherSocketId]: pc };
                    try {
                        const localSdp = await pc.createOffer({
                            offerToReceiveAudio: true,
                            offerToReceiveVideo: true,
                        });
                        await pc.setLocalDescription(new RTCSessionDescription(localSdp));
                        socketClient.emit('offer', {
                            sdp: localSdp,
                            offerSendID: socketClient.id,
                            offerReceiveID: otherSocketId,
                        });
                    } catch (e) {
                        console.error(e);
                    }
                });
            });

            socketClient.on(
                'offer',
                async (data: { sdp: RTCSessionDescription; offerSendID: string }) => {
                    const { sdp, offerSendID } = data;
                    if (!myStream) return;
                    const pc = createPeerConnection(offerSendID);
                    if (!(pc && socketClient)) return;
                    pcsRef.current = { ...pcsRef.current, [offerSendID]: pc };
                    try {
                        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                        const localSdp = await pc.createAnswer({
                            offerToReceiveVideo: true,
                            offerToReceiveAudio: true,
                        });
                        await pc.setLocalDescription(new RTCSessionDescription(localSdp));
                        socketClient.emit('answer', {
                            sdp: localSdp,
                            answerSendID: socketClient.id,
                            answerReceiveID: offerSendID,
                        });
                    } catch (e) {
                        console.error(e);
                    }
                },
            );

            socketClient.on(
                'answer',
                (data: { sdp: RTCSessionDescription; answerSendID: string }) => {
                    const { sdp, answerSendID } = data;
                    const pc: RTCPeerConnection = pcsRef.current[answerSendID];
                    if (!pc) return;
                    pc.setRemoteDescription(new RTCSessionDescription(sdp));
                },
            );

            socketClient.on(
                'ice',
                async (data: { candidate: RTCIceCandidateInit; candidateSendID: string }) => {
                    const pc: RTCPeerConnection = pcsRef.current[data.candidateSendID];
                    if (!pc) return;
                    await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
                },
            );

            socketClient.on('user_exit', (data: { id: string }) => {
                if (!pcsRef.current[data.id]) return;
                pcsRef.current[data.id].close();
                delete pcsRef.current[data.id];
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== data.id));
            });
        };

        if (socketClient !== undefined) {
            init();
        }
        return () => {
            socketClient.removeListener('others');
            socketClient.removeListener('offer');
            socketClient.removeListener('answer');
            socketClient.removeListener('ice');
            socketClient.removeListener('user_exit');
            users.forEach((user) => {
                if (!pcsRef.current[user.id]) return;
                pcsRef.current[user.id].close();
                delete pcsRef.current[user.id];
            });
        };
    }, [socketClient, createPeerConnection, getMedia]);

    useEffect(() => {
        if (!myStream) return;
        myStream
            .getAudioTracks()
            .forEach((track: MediaStreamTrack) => (track.enabled = device.video));
        myStream
            .getVideoTracks()
            .forEach((track: MediaStreamTrack) => (track.enabled = device.video));
    }, [device]);

    return (
        <Wrapper>
            <MyVideo ref={videoRef} muted autoPlay />
            {users.map((user) => {
                return <OtherVideo key={user.id} stream={user.stream} />;
            })}
        </Wrapper>
    );
};

export default Video;

const MyVideo = styled.video`
    z-index: 101;
    width: 140px;
    height: 100px;
    border: 2px solid #f1ea65;
    border-radius: 16px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const Wrapper = styled.div`
    z-index: 101;
    display: flex;
    width: 100vw;
    justify-content: center;
`;