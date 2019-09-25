/**
 * Player.js
 * =========
 *
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 *
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import SoundRecorder from 'react-native-sound-recorder';
import { RNFFmpeg } from 'react-native-ffmpeg';
import RNFS from 'react-native-fs';

export default function VideoPlayer(props) {
  const [recording, setRecording] = React.useState(false);
  const { fileNum, fileUri } = props;

  async function startAudioRecording() {
    setRecording(true);
    await SoundRecorder.start(RNFS.CachesDirectoryPath + '/audio_' + fileNum + '.mp4')
    .then(function() {
      console.log('started recording');
    });
  }

  function stopAudioRecording() {
    setRecording(false);
    const destPath = RNFS.CachesDirectoryPath + '/output_' + fileNum + '.mp4';

    SoundRecorder.stop()
    .then(function(audio) {
      console.log('Stopped recording, audio file saved at: ' + audio.path);

      //Combine audio and video
      RNFFmpeg.execute('-i ' + fileUri + ' -i ' + audio.path + ' -c copy ' + destPath, ' ')
      .then(media => console.log('FFmpeg process exited with rc ' + media.rc));
    }).catch(function(error) {
      console.log('An error occured while stoping the recording: ' + error);
    });
  }

  let button = (
    <TouchableOpacity onPress={startAudioRecording}
      style={styles.capture}>
      <Text style={{ fontSize: 14 }}> RECORD </Text>
    </TouchableOpacity>
  );

  if (recording) {
    button = (
      <TouchableOpacity
        onPress={stopAudioRecording}
        style={styles.capture}
      >
        <Text style={{ fontSize: 14 }}> STOP </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.videoContainer}>
      <Video source={{ uri: fileUri }}
        ref={(ref) => {
          this.player = ref;
        }}
        onBuffer={this.onBuffer}                // Callback when remote video is buffering
        onEnd={this.onEnd}                      // Callback when playback finishes
        onError={this.videoError}
        muted={false}
        style={styles.backgroundVideo} />

      <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
      {button}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer:{
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fc3',
  },
  backgroundVideo: {
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
