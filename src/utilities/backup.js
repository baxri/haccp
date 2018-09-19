import RNFetchBlob from 'rn-fetch-blob';
import RNFetchBlobOld from 'react-native-fetch-blob';
import { PATH_REALM_FILE, PATH_ZIP, PATH_BACKUP } from './index';
import DeviceInfo from 'react-native-device-info';
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'
import BackgroundUpload from 'react-native-background-upload'

export const upload = async (PATH, DB, name, adminPassword = '') => new Promise(async (resolve, reject) => {
    console.log(PATH);
    console.log(DB);
    console.log(PATH_REALM_FILE);
    console.log(PATH_ZIP);
    console.log(name);

    try {

        let ID = DeviceInfo.getUniqueID();
        let files = await RNFetchBlobOld.fs.ls(PATH);
        let formFiles = [];

        let zipName = name + '.zip';
        let copyFrom = DB;
        let copyTo = PATH + '/' + PATH_REALM_FILE;


        await RNFetchBlob.fs.cp(copyFrom, copyTo);

        if (!(await RNFetchBlob.fs.exists(copyTo))) {
            throw new Error(Strings.CANNOT_COPY_DATABASE_FILE);
        }

        let targetPath = PATH_BACKUP + '/' + zipName;
        let sourcePath = PATH;

        let path = await zip(sourcePath, targetPath);

        // Not to wait for this response
        startUpload(path, name, adminPassword);

    } catch (error) {
        reject(error);
    }
});



export const startUpload = (PATH, name, adminPassword = '') => {
    let ID = DeviceInfo.getUniqueID();
    let path = PATH;

    const options = {
        url: 'http://haccp.milady.io/api/upload-zip',
        path: path,
        method: 'POST',
        field: 'zip',
        type: 'multipart',
        headers: {
            'content-type': 'application/octet-stream',
            'haccp-device': ID,
            'admin-password': adminPassword,
            'name': name,
        },
        notification: {
            enabled: true
        }
    }

    console.log(options);

    BackgroundUpload.startUpload(options).then((uploadId) => {
        console.log('Upload started')
        BackgroundUpload.addListener('progress', uploadId, (data) => {
            console.log(`Progress: ${data.progress}%`)
        })
        BackgroundUpload.addListener('error', uploadId, (data) => {
            console.log(data)
            alert(`Error: ${data.error}%`);
        })
        BackgroundUpload.addListener('cancelled', uploadId, (data) => {
            console.log(`Cancelled!`)
            alert("Canceled!");
        })
        BackgroundUpload.addListener('completed', uploadId, (data) => {
            console.log('Completed!')
            console.log(data)
            alert("Upload Completed");
        })
    }).catch((err) => {
        alert('Upload error!', err);
        console.log('Upload error!', err)
    })
}

