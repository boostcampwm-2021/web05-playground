/* eslint-disable no-return-await */
const makeImageBitMapList = async (objectList: any) => {
    const list = await Promise.all(
        objectList.map(async (object: any) => await getImageBitMap(object.imgSrc)),
    );
    return list;
};

const getImageBitMap = async (imgUrl: string) => {
    const response = await fetch(imgUrl, {
        mode: 'cors',
        credentials: 'include',
    });
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);
    return imageBitmap;
};

export default makeImageBitMapList;
