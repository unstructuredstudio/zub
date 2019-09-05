/**
 * Camera.js
 * =========
 * 
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 * 
 */

import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { RNCamera } from 'react-native-camera';
import VideoPlayer from './Player';

export default function VideoRecorder(props) {

  const [ playing, setPlaying ] = React.useState(false);

  const { recording, setRecording, processing, setProcessing } = props;
  
  let clipUri;
  React.useEffect(() => {
    if(recording) {
      startRecording();
      setPlaying(false);
    } else {
      stopRecording();
    }
  }, [recording]);
  

    const cameraRef = React.useRef();
    if (processing) {
      button = (
        <View style={styles.capture}>
          <ActivityIndicator animating size={18} />
        </View>
      );
    }
    async function startRecording() {
      if(cameraRef && cameraRef.stopRecording) {
        const { uri, codec = "mp4" } = await cameraRef.recordAsync();
        global.clipUrl = uri;
        clipUri = uri;
      }
    }
  
    function stopRecording() {
      if(cameraRef && cameraRef.stopRecording) {
        cameraRef.stopRecording();
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
                ref={cameraRef}
                style={styles.preview}
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
              />
              {
                !recording && <Button onPress={() => setPlaying(true)} title="Play"> Play</Button>
              }
            </>
          )
          
        }
        
      </View>
    );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    display: 'flex',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
