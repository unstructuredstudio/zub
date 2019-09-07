/**
 * Camera.js
 * =========
 * 
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 * 
 */

import * as React from 'react';
import { StyleSheet, View, Button }  from 'react-native';
import { RNCamera } from 'react-native-camera';
import VideoPlayer from './Player';

export default function VideoRecorder(props) {
  let cameraRef;
    
  const [ playing, setPlaying ] = React.useState(false);

  const { recording, setRecording, processing, setProcessing } = props;
  
  let clipUri;
  React.useEffect(() => {
    console.log('recording', recording);
    if(recording === true) {
      try {
        setPlaying(false);
        setTimeout(startRecording, 100);
      } catch(ex) {
        console.log(ex);
      }
    } else if(recording === false) {
      stopRecording();
    }
  }, [recording]);
  

    if (processing) {
      button = (
        <View style={styles.capture}>
          <ActivityIndicator animating size={18} />
        </View>
      );
    }
    async function startRecording() {
        try {
          const { uri, codec = "mp4" } = await cameraRef.recordAsync({});
          global.clipUrl = uri;
        } catch(ex) {
          setRecording(false);
          console.log(ex);
        }
    }
  
    function stopRecording() {
      try {
      cameraRef.stopRecording();
      } catch(ex) {
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
