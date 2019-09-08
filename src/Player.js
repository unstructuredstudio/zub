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
        <Video source={{ uri: global.clipUrl }}
         ref={(ref) => {
           this.player = ref
         }}
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