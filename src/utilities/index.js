import RNFetchBlob from 'react-native-fetch-blob';

export const APP_PICTURE_FOLDER = 'HACCPIMAGES';
export const APP_REALM_FOLDER = 'HACCPDATA';

export const PATH = RNFetchBlob.fs.dirs.SDCardDir + '/' + APP_PICTURE_FOLDER;
export const PATH_REALM = RNFetchBlob.fs.dirs.DocumentDir + '/' + APP_REALM_FOLDER;
export const PATH_REALM_FILE = 'haccp.realm';

export const reverseFormat = (date) => {
    let ar = date.split("-");
    return ar[2] + "-" + ar[1] + "-" + ar[0];
};

export const initFolders = async () => {
    try {
        let a = await RNFetchBlob.fs.mkdir(PATH + '/');
    } catch (error) { }

    try {
        let b = await RNFetchBlob.fs.mkdir(PATH_REALM + '/');
    } catch (error) { }
};

export const realmFilePath = () => {
    return PATH_REALM + '/' + PATH_REALM_FILE;
};

export const FilePicturePath = () => {
    return 'file://' + PATH + '/';
};

export const writePicture = async (result) => {
    var filename = Math.floor(Date.now() / 1000) + '.png';
    var filepath = PATH + "/" + filename;

    try {
        let writed = await RNFetchBlob.fs.writeFile(filepath, result, 'base64');
        return filename;
    } catch (error) {
        alert(error);
    }
};