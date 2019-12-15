![Zub Logo](images/logo-small.png) 

### Development setup (iOS)
* Set up React native CLI: https://facebook.github.io/react-native/docs/getting-started
* Set up on a physical IOS device: https://facebook.github.io/react-native/docs/running-on-device
* Install npm libraries with React v0.60.0+ `npm install`
* Install pods: `cd ios/` and `pod install` (as cocoapods is integrated by default)
* Open the project’s `xcworkspace` file with XCODE to run, deploy, and build the app
* Extra setup:
  * In case you are not relying on the latest version of `react-native-sound-recorder` node module, make additional changes to `ios/RNSRecorder.m` library from this pull request: https://github.com/kevinresol/react-native-sound-recorder/pull/31/files
  * Uncheck rotation mode "PORTRAIT" from XCODE: https://stackoverflow.com/questions/32176548/how-to-disable-rotation-in-react-native or by removing `<string>UIInterfaceOrientationPortrait</string>` from `Info.plist` file
  * Change the function name `componentWillMount` in `node_modules/react-native-animated-bar/index.js` to `UNSAFE_componentWillMount`
  * _Bonus:_ Enable hot-reloading of the application on the device for quick development and debugging

### Development Setup (Android)
* Follow the [React Native CLI setup](https://facebook.github.io/react-native/docs/getting-started.) for Android
* Connect a physical Android device and turn USB debugging on. Make sure the developer mode is switched on
* Use `adb devices` to see if the device is connected and enumerated in the list
* Install npm libraries with React v0.60.0+ `npm install`
* To build and deploy the app on the device, run `react-native run-android --port=8081`
* Extra setup:
  * Add following lines in `AndroidManifest.xml`:
  
        <uses-permission android:name="android.permission.CAMERA" />
        <uses-permission android:name="android.permission.RECORD_AUDIO"/>
        <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
        <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
        
  * Add the following line in `build.gradle` file for the project:

        android {
            ...
            defaultConfig {
            ...
            missingDimensionStrategy 'react-native-camera', 'general'
            }
        }

  * To remove rotation mode "PORTRAIT ", add the following lines to `AndroidManifest.xml`:
    * Under MainActivity <activity> tag: `android:screenOrientation="landscape"`
    * Under `<appplication>` tag: `android:theme="@style/Theme.ReactNative.AppCompat.Light.NoActionBar.FullScreen">`

  * For `react-native-ffmpeg` change `minSdkVersion` to `24` in `build.gradle` and add the following lines to `AndroidManifest.xml`:
    * `package="com.zub" xmlns:tools="http://schemas.android.com/tools">`
    * Under `<application>` tag: `tools:replace="android:theme">`
    * Change the function name `componentWillMount` function in `node_modules/react-native-animated-bar/index.js` to `UNSAFE_componentWillMount`
    * _Bonus:_ Enable hot-reloading of the application on the device for quick development and debugging
