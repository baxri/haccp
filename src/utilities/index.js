import RNFetchBlob from 'react-native-fetch-blob';


export const reverseFormat = (date) => {
    let ar = date.split("-");
    return ar[2] + "-" + ar[1] + "-" + ar[0];
};

export const movePicture = async (fromPath) => {
    let destPath = RNFetchBlob.fs.dirs.PictureDir + '/HACCPIMAGES';

    try {
        let a = await RNFetchBlob.fs.mkdir(destPath);
    } catch (error) {

    }

    try {
        let moved = await RNFetchBlob.fs.mv(fromPath, destPath)

        alert(moved);
    } catch (error) {
        alert(error);
    }


};

export const writePicture = async (result) => {
    let destPath = RNFetchBlob.fs.dirs.PictureDir + '/HACCPIMAGES';

    try {
        let a = await RNFetchBlob.fs.mkdir(destPath);
    } catch (error) {

    }

    var filename = Math.floor(Date.now() / 1000) + '.png';
    var path = destPath + "/" + filename;

    try {

        let writed = await RNFetchBlob.fs.writeFile(path, result, 'base64');
        return filename;

    } catch (error) {
        alert(error);
    }


};