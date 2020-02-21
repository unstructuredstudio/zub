/**
 * Camera.js
 * =========
 *
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 *
 */

import * as React from 'react';
import {Platform} from 'react-native';
import {StyleSheet, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import RNFS from 'react-native-fs';
import VideoPlayer from './Player';
import {PlayerState} from './Constants';
import {generateHash, deleteMediaFile, requestMicPermission} from './Utils';

export default function VideoRecorder(props) {
  let cameraRef;
  const {updatePlayersState, curScreenNum, playersState, updateZubVideoUrl,
    isMerging, setMerging} = props;
  const state = playersState[curScreenNum].state;
  const videoOnly = playersState[curScreenNum].videoOnly;

  React.useEffect(() => {
    async function startRecording() {
      let preVideoOnly;
      try {
        if (Platform.OS === 'android') {
          await requestMicPermission();
        }
        preVideoOnly = videoOnly;
        const options = {path: RNFS.CachesDirectoryPath + '/' + generateHash() +
          '_video_' + curScreenNum + '.mp4'};
        const {uri} = await cameraRef.recordAsync(options);
        await deleteMediaFile(preVideoOnly);
        updatePlayersState('videoOnly', uri);
      } catch (ex) {
        console.log(ex);
      }
    }

    async function stopRecording() {
      try {
        console.log('Stop the recording...');
        await cameraRef.stopRecording();
      } catch (ex) {
        console.log(ex);
      }
    }

    if (state === PlayerState.START_VIDEO_RECORDING) {
      try {
        setTimeout(startRecording, 100);
      } catch (ex) {
        console.log(ex);
      }
    } else if (state === PlayerState.VIDEO_SAVED) {
      stopRecording();
    }
  }, [state, curScreenNum, videoOnly, cameraRef, updatePlayersState]);

  return (
    <View style={styles.cameraContainer}>
      {
        (state === PlayerState.VIDEO_SAVED) &&
        <VideoPlayer
          playersState={playersState}
          updatePlayersState={updatePlayersState}
          updateZubVideoUrl={updateZubVideoUrl}
          curScreenNum={curScreenNum}
          isMerging={isMerging}
          setMerging={setMerging}
        />
      }
      {
        (state === PlayerState.NONE || state ===
          PlayerState.START_VIDEO_RECORDING) && (
          <>
            <RNCamera
              ref={(ref) => {
                cameraRef = ref;
              }}
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
              captureAudio={true} />
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
