/**
 * Player.js
 * =========
 *
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 *
 */

import React from 'react';
import { StyleSheet, View, Platform} from 'react-native';
import Video from 'react-native-video';
import SoundRecorder from 'react-native-sound-recorder';
import { RNFFmpeg } from 'react-native-ffmpeg';
import RNFS from 'react-native-fs';
import AwesomeButtonCartman from 'react-native-really-awesome-button/src/themes/cartman';
import {requestMicPermission } from './Utils';

export default function VideoPlayer(props) {
  const [recording, setRecording] = React.useState(false);
  const { fileNum, fileUri } = props;

  async function startAudioRecording() {
    setRecording(true);
    if (Platform.OS === "android") {
      await requestMicPermission();
    }
    await SoundRecorder.start(RNFS.CachesDirectoryPath + '/audio_' + fileNum + '.mp4')
    .then(function() {
      console.log('Started Audio Recording');
    });
  }

  function stopAudioRecording() {
    setRecording(false);
    const destPath = RNFS.CachesDirectoryPath + '/output_' + fileNum + '.mp4';

    SoundRecorder.stop()
    .then(function(audio) {
      console.log('Stopped audio recording, audio file saved at: ' + audio.path);

      //Combine audio and video
      RNFFmpeg.execute('-i ' + fileUri + ' -i ' + audio.path + ' -c copy ' + destPath, ' ')
      .then(media => console.log('FFmpeg process exited with rc ' + media.rc));
    }).catch(function(error) {
      console.log('An error occured while stoping the recording: ' + error);
    });
  }

  let button = (
    <AwesomeButtonCartman
      borderRadius={10}
      height={50}
      stretch={true}
      raiseLevel={5}
      type="secondary"
      onPress={startAudioRecording} title="Record">
      Record Audio ⬤  
    </AwesomeButtonCartman>
  );

  if (recording) {
    button = (
      <AwesomeButtonCartman
        borderRadius={10}
        height={50}
        stretch={true}
        raiseLevel={5}
        type="secondary"
        onPress={stopAudioRecording} title="Stop">
        Stop ■ 
      </AwesomeButtonCartman>
    );
  }

  return (
    <View style={styles.videoContainer}>
      <Video source={{ uri: fileUri }}
        // TODO: We will use this eventually, keeping them here so we remember ;-)
        // ref={(ref) => {
        //   this.player = ref;
        // }}
        // onBuffer={this.onBuffer}                // Callback when remote video is buffering
        // onEnd={this.onEnd}                      // Callback when playback finishes
        // onError={this.videoError}
        muted={false}
        style={styles.backgroundVideo}>
      </Video>
        <View style={styles.box}>
          {button}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundVideo: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexGrow: 1,
  },
  videoContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
    overflow: 'hidden', // Needed for Android
    borderRadius: 10,
  },
  box: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: '22%',
  },
});
