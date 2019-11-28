# Zub

### Development setup (iOS)
* React native CLI setup here: https://facebook.github.io/react-native/docs/getting-started.
* To get setup to test the app on a physical IOS device, follow the instructions here: https://facebook.github.io/react-native/docs/running-on-device. 
* Open the project’s xcworkspace file with xcode

### Development Setup (Android)

* Follow the [React Native CLI setup](https://facebook.github.io/react-native/docs/getting-started.) for Android
* Connect a physical Android device and turn USB debugging on. Make sure the developer mode is switched on
* Use `adb devices` to see if the device is connected and enumerated in the list

### Installing npm libraries with React v0.60.0+ 
* Install the required modules:
  * `npm install react-native-camera --save`
  * `npm install react-native-video --save`
  * `npm install react-navigation --save`
  * `npm install react-native-gesture-handler --save`
  * `npm install react-native-really-awesome-button --save`
  * `npm install react-native-animated-bar --save`
  * `npm install react-native-ffmpeg --save`
  * `npm install react-native-sound-recorder --save`
  * `npm install react-native-fontawesome --save`

#### Extra Setup (iOS)
* `cd ios/`
* `pod install` (as cocoapods is integrated by default)
* In case you are not relying on the latest version of `react-native-sound-recorder` node module, make additional changes to `ios/RNSRecorder.m` library from this pull request: https://github.com/kevinresol/react-native-sound-recorder/pull/31/files

#### Extra Setup (Android)
* Add following lines in `AndroidManifest.xml`

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

* Since Zub is in fullscreen landscape mode by default, add the following lines to `AndroidManifest.xml` 

  * Under `MainActivity`'s `<activity>` tag:

        android:screenOrientation="landscape"

  * Under `<appplication>` tag:

        android:theme="@style/Theme.ReactNative.AppCompat.Light.NoActionBar.FullScreen">

* For `react-native-ffmpeg` change `minSdkVersion` to `24` in `build.gradle` and add the following lines to `AndroidManifest.xml`

  * `package="com.zub" xmlns:tools="http://schemas.android.com/tools">`

  * Under `<application>` tag:

        tools:replace="android:theme">

### Build and Install
* On iOS, use XCode GUI to build and deploy the app directly
* On Android, simply `react-native run-android --port=8081` on a shell which will build and deploy the app on the device.
* _Bonus:_ Enable hot-reloading of the application on the device for quick development and debugging


