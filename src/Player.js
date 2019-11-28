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
import { PlayerState } from './Constants';
import RNFS from 'react-native-fs';
import AwesomeButtonCartman from 'react-native-really-awesome-button/src/themes/cartman';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
import { requestMicPermission, deleteMediaFile, moveMediaFile } from './Utils';
import { mergeVideos } from './Utils';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

export default function VideoPlayer(props) {
  let videoPlayer;
  const { curScreenNum, updatePlayersState, playersState, updateZubVideoUrl } = props,
    state = playersState[curScreenNum].state,
    filePath = playersState[curScreenNum].filePath;
    const [ videoPaused, setVideoPaused ] = React.useState(true);

  React.useEffect(() => {
    async function startAudioRecording() {
      let options = {};
      if (Platform.OS === 'android') {
        // We need to specify audio codec as AAC for audio in Android
        options = {
          encoder: 3,    // AAC (https://developer.android.com/reference/android/media/MediaRecorder.AudioEncoder#AAC)
        };
        await requestMicPermission();
      }

      await SoundRecorder.start(RNFS.CachesDirectoryPath + '/audio_' + curScreenNum + '.mp4', options)
      .then(function() {
        console.log('Started Audio Recording');
      });
    }

    async function stopAudioRecording() {
      const destPath = RNFS.CachesDirectoryPath + '/output_' + curScreenNum + '.mp4';
      await deleteMediaFile(destPath);

      await SoundRecorder.stop()
      .then(function(audio) {
        console.log('Stopped audio recording, audio file saved at: ' + audio.path);

        //Combine audio and video
        RNFFmpeg.execute('-i ' + filePath + ' -i ' + audio.path + ' -c copy ' + destPath, ' ')
        .then(function(media) {
          console.log('FFmpeg process exited with rc ' + media.rc);
          deleteMediaFile(filePath);
          moveMediaFile(destPath, filePath);
        });
      }).catch(function(error) {
        console.log('An error occured while stoping the recording: ' + error);
      });

      //TODO: videoPlayer.load();
    }

    if (state === PlayerState.PLAYING) {
      try {
        setTimeout(startAudioRecording, 100);
      } catch (ex) {
        console.log(ex);
      }
    } else if (state === PlayerState.SAVED) {
      try {
        stopAudioRecording();
      } catch (ex) {
        console.log(ex);
      }
    }

    return stopAudioRecording;
  }, [state, updatePlayersState]);

  return (
    <View style={styles.videoContainer}>
      <Video
        ref={ref => { videoPlayer = ref; }}
        source={{ uri: filePath }}
        muted={false}
        style={styles.backgroundVideo}
        repeat={true}
        paused={videoPaused}
        onEnd={() => {
          setVideoPaused(!videoPaused);
        }}
        onLoad={(data) => {
          updatePlayersState('videoDuration', Math.round(data.duration));
        }}
      />

      {
        playersState[0].filePath !== '' && playersState[1].filePath !== '' &&
        playersState[2].filePath !== '' &&
        <View style={styles.mergeButton}>
          <AwesomeButtonRick
            borderRadius={50}
            height={50}
            stretch={true}
            textSize={30}
            type="anchor"
            onPress={() => {
              mergeVideosAndUpdateUrl();
          }}>
            ✓
          </AwesomeButtonRick>
        </View>
      }
      <View style={styles.playButton}>
        <AwesomeButtonRick
          borderRadius={50}
          textSize={30}
          stretch={true}
          type="secondary"
          onPress={() => {
            setVideoPaused(!videoPaused);
          }}>
          { videoPaused ?
          <FontAwesomeIcon
            icon={faPlay}
            color={'#349890'}
          /> :
          <FontAwesomeIcon
            icon={faPause }
            color={'#349890'}
          />
          }
        </AwesomeButtonRick>
      </View>

      <View style={styles.box}>
        <AwesomeButtonCartman
          borderRadius={10}
          height={50}
          stretch={true}
          raiseLevel={5}
          type="secondary"
          onPress={() => {
            let isStatePlaying = state === PlayerState.PLAYING;
            if(!isStatePlaying) {
              videoPlayer.seek(0);
            }
            setVideoPaused(isStatePlaying);
            updatePlayersState('state', state);
          }}
          title="Record">
          {
            state === PlayerState.PLAYING ? 'Stop ■' : 'Record Audio ⬤'
          }
          </AwesomeButtonCartman>
        </View>
    </View>
  );

  async function mergeVideosAndUpdateUrl() {
    let merged_video = await mergeVideos();
    if (merged_video) {
      updateZubVideoUrl(merged_video);
    }
  }
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
  mergeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: '22%',
  },
  playButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: '10%',
  },
});
