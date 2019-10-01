/**
 * Camera.js
 * =========
 *
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 *
 */

import * as React from 'react';
import { StyleSheet, View }  from 'react-native';
import { RNCamera } from 'react-native-camera';
import RNFS from 'react-native-fs';
import VideoPlayer from './Player';
import { PlayerState } from './Constants';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';

export default function VideoRecorder(props) {
  let cameraRef;

  const { state, updateState, curScreenNum, updateClipUri, fileUri } = props;

  React.useEffect(() => {
    async function startRecording() {
      try {
        const options = { path: RNFS.CachesDirectoryPath + '/video_' + curScreenNum + '.mp4' };
        const { uri } = await cameraRef.recordAsync(options);
        global.clipUri = uri;
        updateClipUri(uri);
      } catch (ex) {
        console.log(ex);
        updateState();
      }
    }

    function stopRecording() {
      try {
          cameraRef.stopRecording();
      } catch (ex) {
        console.log(ex);
      }
    }

    if (state === PlayerState.RECORDING) {
      try {
        setTimeout(startRecording, 100);
      } catch (ex) {
        console.log(ex);
      }
    } else if (state === PlayerState.SAVED){
      stopRecording();
    }

    return stopRecording;

  }, [state, curScreenNum]);

  return (
    <View style={styles.cameraContainer}>
      {
        (state === PlayerState.SAVED || state === PlayerState.PLAYING) && <VideoPlayer fileUri={fileUri} fileNum={curScreenNum} />
      }
      {
        (state === PlayerState.NONE || state === PlayerState.RECORDING) && (
          <>
            <RNCamera
              ref={ref => { cameraRef = ref; }}
              style={styles.cameraContainer}
              type={RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.off}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              androidRecordAudioPermissionOptions={{
                title: 'Permission to use audio recording',
                message: 'We need your permission to use your audio',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              captureAudio={false}>
              {
                // TODO We neet to move player button when auto-preview mode is eventually disabled
                state === PlayerState.PLAYING &&  (
                <>
                  <View style={styles.box}>
                    <AwesomeButtonRick
                      borderRadius={50}
                      height={50}
                      stretch={true}
                      type="anchor"
                      onPress={() => setPlaying(true)} title="Play">
                      PLAY ▶
                    </AwesomeButtonRick>
                  </View>
                  <View style={styles.box} />
                  <View style={styles.box} />
                  <View style={styles.box} />
                </>
                )
              }
            </RNCamera>
          </>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
    overflow: 'hidden', // Needed for Android
    borderRadius: 10,
  },
  box: {
    flex: 1,
    margin: 20,
    height: '100%',
  },
});
