"react-native-zip-archive": "github:mockingbot/react-native-zip-archive#fix-zip-progress",

# INSTALLATION

Download and install github project on your local computer run this command:

## SSH
```bash
git clone git@github.com:jrenouard/haccp.git
```

## HTTPS
```bash
git clone https://github.com/jrenouard/haccp.git
```

<hr>

```bash
cd haccp
```

```bash
npm install
```

# INSTRUCTION TO BUILT APK

make sure that you configured you local enviroment to run this project, if not you can use this guide

[Android Setup](https://www.decoide.org/react-native/docs/android-setup.html)


## Generating Signed APK

There is a complete guide to generate apk from the github source

[Generating Signed APK](https://facebook.github.io/react-native/docs/signed-apk-android.html)

If you have configured everythig okey, then you can navigate to android directory: 

```bash
cd android
```

And run this command

```bash
./gradlew assembleRelease
```

MYAPP_RELEASE_KEY_PASSWORD=123456

You can find new apk generated apk in this directory

```bash
android/app/build/outputs/apk/app-release.apk
```

ENJOY :tada: