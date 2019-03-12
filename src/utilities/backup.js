import RNFetchBlob from 'rn-fetch-blob';
import { PATH_REALM_FILE, PATH_ZIP, PATH_BACKUP } from './index';
import DeviceInfo from 'react-native-device-info';
import zip from 'react-native-zip-archive'
import BackgroundUpload from 'react-native-background-upload'
import {Linking, ToastAndroid} from 'react-native';
import Strings from '../language/fr'
import { UploadIcon } from '../components/header';

export const upload = async (PATH, DB, name, adminPassword = '') => new Promise(async (resolve, reject) => {
    console.log(PATH);
    console.log(DB);
    console.log(PATH_REALM_FILE);
    console.log(PATH_ZIP);
    console.log(name);

    try {

        let zipName = name + '.zip';
        let copyFrom = DB;
        let copyTo = PATH + '/' + PATH_REALM_FILE;

        await RNFetchBlob.fs.cp(copyFrom, copyTo);

        if (!(await RNFetchBlob.fs.exists(copyTo))) {
            throw new Error(Strings.CANNOT_COPY_DATABASE_FILE);
        }

        let targetPath = PATH_BACKUP + '/' + zipName;
        let sourcePath = PATH;

        zip(sourcePath, targetPath).then(() => {

        }).cath(() => {

        });

        // Not to wait for this response
        startUpload(path, name, adminPassword);

        resolve("OK");
    } catch (error) {
        reject(error);
    }
});



export const startUpload = (PATH, name, adminPassword = '') => {
    let upIcon = new UploadIcon();
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
            enabled: false
        }
    }
    
    BackgroundUpload.startUpload(options).then((uploadId) => {
        ToastAndroid.show(Strings.DATA_UPLOADED_START, ToastAndroid.LONG);
        console.log('Upload started')
        
        // TODO: How to change state from backup.js
        upIcon.setState({active: 1, progress: 0});

        BackgroundUpload.addListener('progress', uploadId, (data) => {
            console.log(`Progress: ${data.progress}%`)

            upIcon.setState({active: 1, progress: parseInt(data.progress)});
        });

        BackgroundUpload.addListener('error', uploadId, (data) => {
            ToastAndroid.show(Strings.DATA_UPLOADED_ERROR, ToastAndroid.LONG);
            console.log(`Error: ${data.error}%`)

            upIcon.setState({active: 0, progress: 0});
        });

        BackgroundUpload.addListener('cancelled', uploadId, (data) => {
            ToastAndroid.show(Strings.DATA_UPLOADED_CANCELED, ToastAndroid.LONG);
            console.log(`Cancelled!`)

            upIcon.setState({active: 0, progress: 0});
        });

        BackgroundUpload.addListener('completed', uploadId, (data) => {
            // data includes responseCode: number and responseBody: Object
            ToastAndroid.show(Strings.DATA_SUCCESSFULLY_UPLOADED, ToastAndroid.LONG);
            console.log('Completed!')

            upIcon.setState({active: 0, progress: 0});
        });

    }).catch((err) => {
        console.log('Upload error!', err)

        upIcon.setState({active: 0, progress: 0});
    });
}


export const startDownload = (backupID) => {
    Linking.openURL('http://haccp.milady.io/admin/download/' + backupID);
    // return;

    // let path = `${PATH_ZIP}/${backupID}.zip`;
    // let lostTasks = await BackgroundDowoloader.checkForExistingDownloads();

    // let task = BackgroundDowoloader.download({
    //     id: backupID,
    //     url: 'http://haccp.milady.io/admin/download/' + backupID,
    //     destination: path
    // }).begin((expectedBytes) => {
    //     console.log(`Going to download ${expectedBytes} bytes!`);
    // }).progress((percent) => {
    //     console.log(`Downloaded: ${percent * 100}%`);
    // }).done(() => {
    //     console.log('Download is done!');
    // }).error((error) => {
    //     console.log('Download canceled due to error: ', error);
    // });

    // console.log(lostTasks);
}

