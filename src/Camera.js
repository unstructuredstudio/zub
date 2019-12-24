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
import {  generateHash, deleteMediaFile, listDirContents } from './Utils';

export default function VideoRecorder(props) {
  let cameraRef;
  const { updatePlayersState, curScreenNum, playersState, updateZubVideoUrl,
   isMerging, setMerging } = props;
  const state = playersState[curScreenNum].state;
  const videoOnly = playersState[curScreenNum].videoOnly
  const videoWithAudio = playersState[curScreenNum].videoWithAudio

  React.useEffect(() => {
    async function startRecording() {
      try {
        // listDirContents(RNFS.CachesDirectoryPath);
        preVideoOnly = videoOnly;
        preVideoWithAudio = videoWithAudio;
        const options = { path: RNFS.CachesDirectoryPath + '/' + generateHash() +
          '_video_' + curScreenNum + '.mp4' },
          { uri } = await cameraRef.recordAsync(options);
        await deleteMediaFile(preVideoOnly);
        if (preVideoWithAudio != '') {
          await deleteMediaFile(preVideoWithAudio);
        }
        updatePlayersState('videoOnly', uri);
        // listDirContents(RNFS.CachesDirectoryPath);
      } catch (ex) {
        console.log(ex);
      }
    }

    async function stopRecording() {
      try {
        console.log('Stop the recording...');
        updatePlayersState('videoWithAudio', '');
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
    } else if (state === PlayerState.VIDEO_SAVED){
      stopRecording();
    }
  }, [state, curScreenNum, videoOnly, videoWithAudio]);

  return (
    <View style={styles.cameraContainer}>
      {
        (state === PlayerState.VIDEO_SAVED || state === PlayerState.STOP_AUDIO_RECORDING || state === PlayerState.START_AUDIO_RECORDING ||
          state === PlayerState.AUDIO_VIDEO_SAVED) &&
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
        (state === PlayerState.NONE || state === PlayerState.START_VIDEO_RECORDING) && (
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
