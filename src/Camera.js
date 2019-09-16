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
import VideoPlayer from './Player';

import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';

export default function VideoRecorder(props) {
  let cameraRef;
  const [ playing, setPlaying ] = React.useState(false);
  const { recording, setRecording} = props;

  let clipUri;
  React.useEffect(() => {
    console.log('recording', recording);
    if (recording === true) {
      try {
        setPlaying(false);
        setTimeout(startRecording, 100);
      } catch (ex) {
        console.log(ex);
      }
    } else if (recording === false) {
      stopRecording();
    }
  }, [recording]);

  async function startRecording() {
      try {
        const { uri, codec = 'mp4' } = await cameraRef.recordAsync({});
        global.clipUrl = uri;
      } catch (ex) {
        setRecording(false);
        console.log(ex);
      }
  }

  function stopRecording() {
    try {
    cameraRef.stopRecording();
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <View style={styles.cameraContainer}>
      {
        playing && <VideoPlayer clipUri={clipUri} />
      }
      {
        !playing && (
          <>
            <RNCamera
              ref={ref => cameraRef = ref}
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
              captureAudio={false}
            >
              {
              !recording &&  (
              <>
                <View style={styles.box}>
                  <AwesomeButtonRick
                    borderRadius={50}
                    height={50}
                    stretch={true}
                    type="anchor"
                    onPress={() => setPlaying(true)} title="Play"> PLAY ▶ </AwesomeButtonRick>
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
