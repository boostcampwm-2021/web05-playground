import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

interface Props {
    stream: MediaStream;
}

const OtherVideo = ({ stream }: Props) => {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (ref.current) ref.current.srcObject = stream;
    }, [stream]);

    return <VideoContainer ref={ref} autoPlay />;
};

export default OtherVideo;

const VideoContainer = styled.video`
    z-index: 101;
    width: 140px;
    height: 100px;
    border: 2px solid #f1ea65;
    border-radius: 16px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;
