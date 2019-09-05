/**
 * Player.js
 * =========
 * 
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 * 
 */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Video from 'react-native-video';

export default class VideoPlayer extends Component {
  render() {
    return(
      <View style={styles.videoContainer}>
        <Video source={{ uri: global.clipUrl || this.props.clipUri }}   // Can be a URL or a localfile.
         ref={(ref) => {
           this.player = ref
         }}                                      // Store reference
         onBuffer={this.onBuffer}                // Callback when remote video is buffering
         onEnd={this.onEnd}                      // Callback when playback finishes
         onError={this.videoError}               // Callback when video cannot be loaded
         style={styles.backgroundVideo} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  videoContainer:{ flex: 1, justifyContent: "center"},
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});