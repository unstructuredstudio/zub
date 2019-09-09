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
import { LogLevel, RNFFmpeg } from 'react-native-ffmpeg';

export default class VideoPlayer extends Component {
  constructor(props){
    super(props);
    this.state = {
      recording: false
    }
  }

  render() {
    const { recording } = this.state;

    let button = (
      <TouchableOpacity onPress={this.startAudioRecording.bind(this)}
        style={styles.capture}>
        <Text style={{ fontSize: 14 }}> RECORD </Text>
      </TouchableOpacity>
    );

    if (recording) {
      button = (
        <TouchableOpacity
          onPress={this.stopAudioRecording.bind(this)}
          style={styles.capture}
        >
          <Text style={{ fontSize: 14 }}> STOP </Text>
        </TouchableOpacity>
      );
    }

    return(
      <View style={styles.videoContainer}>
        <Video source={{ uri: global.clipUrl }}
          ref={(ref) => {
            this.player = ref
          }}
          onBuffer={this.onBuffer}                // Callback when remote video is buffering
          onEnd={this.onEnd}                      // Callback when playback finishes
          onError={this.videoError}
          muted={false}
          style={styles.backgroundVideo} />

        <View style={{ flex: 0, flexDirection: "row", justifyContent: "center" }}>
        {button}
        </View>
      </View>
    );
  }

  async startAudioRecording() {
    this.setState({ recording: true });
    await SoundRecorder.start(SoundRecorder.PATH_CACHE + '/audio.mp4')
    .then(function() {
      console.log('started recording'); 
    });
  }

  stopAudioRecording() {
    this.setState({ recording: false });
    SoundRecorder.stop()
    .then(function(result) {
      console.log('Stopped recording, audio file saved at: ' + result.path);

      //Combine audio and video
      RNFFmpeg.execute('-i ' + global.clipUrl + ' -i ' + result.path + ' -c copy ' + SoundRecorder.PATH_CACHE + '/output.mov', ' ').then(result => console.log("FFmpeg process exited with rc " + result.rc));
    }).catch(function(error) {
      console.log("An error occured while stoping the recording: " + error);
    });
  }
}

const styles = StyleSheet.create({
  videoContainer:{
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fc3'
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