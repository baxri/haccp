import RNFetchBlob from 'rn-fetch-blob';
import RNFetchBlobOld from 'react-native-fetch-blob';
import { PATH_REALM_FILE, PATH_ZIP, PATH_BACKUP } from './index';
import DeviceInfo from 'react-native-device-info';
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'
import Upload from 'react-native-background-upload'

export const upload = async (PATH, DB, name, adminPassword = '') => new Promise(async (resolve, reject) => {
    console.log(PATH);
    console.log(DB);
    console.log(PATH_REALM_FILE);
    console.log(PATH_ZIP);
    console.log(name);

    try {

        alert(Upload);

        resolve("OK");
        return;

        let ID = DeviceInfo.getUniqueID();
        let files = await RNFetchBlobOld.fs.ls(PATH);
        let formFiles = [];

        // var zipName = 'last-backup.zip';
        let zipName = name + '.zip';

        let copyFrom = DB;
        let copyTo = PATH + '/' + PATH_REALM_FILE;

        console.log(copyFrom);
        console.log(copyTo);

        // Copy realm file to main images folder
        await RNFetchBlob.fs.cp(copyFrom, copyTo);

        if (!(await RNFetchBlob.fs.exists(copyTo))) {
            throw new Error(Strings.CANNOT_COPY_DATABASE_FILE);
        }

        let targetPath = PATH_BACKUP + '/' + zipName;
        let sourcePath = PATH;

        console.log(targetPath);
        console.log(sourcePath);

        let path = await zip(sourcePath, targetPath);


        resolve(path);
        return;

        // resolve(path);
        // return;

        // formFiles.push({ name: 'zip', filename: zipName, data: RNFetchBlob.wrap(path) });

        // console.log(formFiles);

        // let resp = await RNFetchBlob.fetch('POST', 'http://haccp.milady.io/api/upload-zip', {
        //     'haccp-device': ID,
        //     'admin-password': adminPassword,
        //     'name': name,
        //     'Content-Type': 'multipart/form-data',
        // }, formFiles);

        // let parsedResponse = resp.text();

        // resolve(resp.text());
        // return;

        // formFiles.push({ name: 'realm', filename: PATH_REALM_FILE, data: RNFetchBlob.wrap(DB) });

        // if (files.length > 0) {
        //     for (let i = 0; i < files.length; i++) {
        //         let file = files[i];
        //         formFiles.push({ name: 'images[]', filename: file, data: RNFetchBlob.wrap(PATH + "/" + file) });
        //     }
        // }

        // alert(adminPassword);
        // return;

        // let resp = await RNFetchBlob.fetch('POST', 'http://haccp.milady.io/api/upload', {
        //     'haccp-device': ID,
        //     'admin-password': adminPassword,
        //     'name': name,
        //     'Content-Type': 'multipart/form-data',
        // }, formFiles);

        // let parsedResponse = resp.text();

        // if (parsedResponse != 200) {
        //     if (parsedResponse.length > 0) {
        //         throw new Error(parsedResponse);
        //     } else {
        //         throw new Error('CANNOT_UPLOAD_FILE');
        //     }
        // }

        // console.log(parsedResponse);
        // resolve(resp.text());
    } catch (error) {
        reject(error);
    }
});

