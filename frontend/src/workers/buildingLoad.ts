/* eslint-disable no-return-await */
const imageMap = new Map();
imageMap.set(
    'https://cdn.discordapp.com/attachments/905266906259419141/907927778584829982/pngwing.com.png',
    'https://jwwhhmlzueei8656692.cdn.ntruss.com/building1.png',
);
imageMap.set(
    'https://media.discordapp.net/attachments/905266906259419141/908349179703726080/pngwing.com_6.png',
    'https://jwwhhmlzueei8656692.cdn.ntruss.com/building3.png',
);
imageMap.set(
    'https://media.discordapp.net/attachments/905266906259419141/909676468689326080/premium-icon-whiteboard-2293918_1.png',
    'https://jwwhhmlzueei8656692.cdn.ntruss.com/object1.png',
);

// 일단 지금 cors 설정때문에 임시로 데이터 변경
const getImageBitMap = async (imgUrl: string) => {
    const convertImgUrl = imageMap.get(imgUrl);
    const response = await fetch(convertImgUrl, {
        mode: 'cors',
        credentials: 'include',
    });
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);
    return imageBitmap;
};

export default getImageBitMap;
