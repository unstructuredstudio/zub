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
import { requestMicPermission, deleteMediaFile } from './Utils';
import { mergeVideos, generateHash } from './Utils';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

export default function VideoPlayer(props) {
  const { curScreenNum, updatePlayersState, playersState, updateZubVideoUrl } = props,
    state = playersState[curScreenNum].state,
    [ videoPaused, setVideoPaused ] = React.useState(true);

  let playerRef,
    videoOnly = playersState[curScreenNum].videoOnly,
    videoWithAudio = playersState[curScreenNum].videoWithAudio;

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
      const destPath = RNFS.CachesDirectoryPath + '/' + generateHash() + '_output_' +
        curScreenNum + '.mp4';

      await deleteMediaFile(videoWithAudio);
      await SoundRecorder.stop()
      .then(function(audio) {
        console.log('Stopped audio recording, audio file saved at: ' + audio.path);
        //Combine audio and video
        RNFFmpeg.execute('-i ' + videoOnly + ' -i ' + audio.path + ' -c copy ' + destPath, ' ')
        .then(function(media) {
          console.log('FFmpeg process exited with rc ' + media.rc);
          updatePlayersState('videoWithAudio', destPath);
        });
      }).catch(function(error) {
        console.log('An error occured while stoping the recording: ' + error);
      });
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
  }, [state]);

  if(videoOnly || videoWithAudio) {
    const recordButton = 
        <AwesomeButtonCartman
          borderRadius={10}
          height={50}
          stretch={true}
          raiseLevel={5}
          type="secondary"
          onPress={() => {
            let isStatePlaying = state === PlayerState.PLAYING;
            if(!isStatePlaying) {
              playerRef.seek(0);
            }
            setVideoPaused(isStatePlaying);
    
            let newState;
            if(state !== PlayerState.PREVIEW || PlayerState.PLAYING) {
              newState = PlayerState.PREVIEW;
            } else {
              newState = state;
            }
            updatePlayersState('state', newState);
          }}
          title="Record">
            Record Audio ⬤
        </AwesomeButtonCartman>
    
    const recordingInProgress = 
        <AwesomeButtonCartman
          borderRadius={10}
          height={50}
          stretch={true}
          raiseLevel={5}
          type="disabled"
          title="Recording in progress">
            Recording...
        </AwesomeButtonCartman>

    return (
      <View style={styles.videoContainer}>
        <Video
          ref={ref => { playerRef = ref; }}
          source={{ uri: videoWithAudio ? videoWithAudio : videoOnly }}
          muted={false}
          style={styles.backgroundVideo}
          repeat={true}
          paused={videoPaused}
          resizeMode="cover"
          onEnd={() => {
            setVideoPaused(!videoPaused);
          }}
          onLoad={(data) => {
            updatePlayersState('videoDuration', Math.round(data.duration));
          }}
        />

        {
          playersState[0].videoOnly !== '' && playersState[1].videoOnly !== '' &&
          playersState[2].videoOnly !== '' &&
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
          {state !== PlayerState.PLAYING ? recordButton: recordingInProgress}
        </View>
      </View>
    );
  } else {
    return(null);
  }

  async function mergeVideosAndUpdateUrl() {
    let merged_video = await mergeVideos(playersState);
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
