/* eslint-disable no-return-await */

const getImageBitMap = async (imgUrl: string) => {
    const response = await fetch(imgUrl);
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);
    return imageBitmap;
};

export default getImageBitMap;
