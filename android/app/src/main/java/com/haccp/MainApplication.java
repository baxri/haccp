package com.haccp;

import android.app.Application;

import com.facebook.react.ReactApplication;
import io.realm.react.RealmReactPackage;
import io.realm.react.RealmReactPackage;
import io.realm.react.RealmReactPackage;
import io.realm.react.RealmReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;
import io.realm.react.RealmReactPackage; // add this import
import com.imagepicker.ImagePickerPackage; // <-- add this import
import com.rssignaturecapture.RSSignatureCapturePackage;
import com.rnfs.RNFSPackage; // <------- add package
import com.vydia.RNUploader.UploaderReactPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new RNDeviceInfo(),
          new MainReactPackage(),
          new RealmReactPackage(),
          new ImagePickerPackage(),
          new RSSignatureCapturePackage(),
          new RNFSPackage(),
          new UploaderReactPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
