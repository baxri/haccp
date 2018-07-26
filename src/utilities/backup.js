import RNFetchBlob from 'rn-fetch-blob';
import RNFetchBlobOld from 'react-native-fetch-blob';
import { PATH_REALM_FILE } from './index';
import DeviceInfo from 'react-native-device-info';

export const upload = async (PATH, DB, name) => new Promise(async (resolve, reject) => {
    console.log(PATH);
    console.log(DB);
    console.log(PATH_REALM_FILE);
    console.log(name);

    try {

        let ID = DeviceInfo.getUniqueID();
        let files = await RNFetchBlobOld.fs.ls(PATH);
        let formFiles = [];

        console.log(ID);

        formFiles.push({ name: 'realm', filename: PATH_REALM_FILE, data: RNFetchBlob.wrap(DB) });

        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                formFiles.push({ name: 'images[]', filename: file, data: RNFetchBlob.wrap(PATH + "/" + file) });
            }
        }

        let resp = await RNFetchBlob.fetch('POST', 'http://haccp.milady.io/api/upload', {
            'haccp-device': ID,
            'name': name,
            'Content-Type': 'multipart/form-data',
        }, formFiles);

        console.log(resp.text());
        resolve(resp.text());
    } catch (error) {
        reject(error);
    }
});

