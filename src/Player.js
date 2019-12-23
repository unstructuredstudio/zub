/**
 * Player.js
 * =========
 *
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 *
 */

import React from 'react';
import { StyleSheet, View, Platform, Text} from 'react-native';
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
import { faPlay, faPause, faCheckCircle, faRedo } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-native-modal';

export default function VideoPlayer(props) {
  const { curScreenNum, updatePlayersState, playersState, updateZubVideoUrl,
    isMerging, setMerging } = props,
    state = playersState[curScreenNum].state,
    [ videoPaused, setVideoPaused ] = React.useState(true),
    [ isModalVisible, setIsModalVisible ] = React.useState(false),
    [ missingAudiosMsg, setMissingAudiosMsg ] = React.useState('');

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

    // This formats the vide duration in the string needed by ffmpeg
    const getVideoDurationInStringFormat = (num) => {
      let num1 = +num;
      let str = '';
      if(num1 < 10) {
        str = str + '0' + num1;
      } else if(num1 < 60) {
        str = str + num1;
      }
      return `00:00:${str}`;
    }
    async function stopAudioRecording() {
      const destPath = RNFS.CachesDirectoryPath + '/' + generateHash() + '_output_' +
        curScreenNum + '.mp4';

      await deleteMediaFile(videoWithAudio);
      await SoundRecorder.stop()
      .then(async function(audio) {
        console.log('Stopped audio recording, audio file saved at: ' + audio.path);
        const videoLen = (await RNFFmpeg.getMediaInformation(videoOnly)).duration;
        const newVideoDuration = Math.round(videoLen/1000).toFixed(0);
        // We need the -t option to truncate the recorded audio + video to the length of video
        const stmt =`-i ${videoOnly} -i ${audio.path} -t ${getVideoDurationInStringFormat(newVideoDuration)} -c copy ${destPath}`;
        RNFFmpeg.execute(stmt, ' ')
        .then(function(media) {
          console.log('FFmpeg process exited with rc ' + media.rc);
            updatePlayersState('videoWithAudio', destPath);
            updatePlayersState('state', state);
        });
      }).catch(function(error) {
        console.log('An error occured while stoping the recording: ' + error);
      });
    }

    if (state === PlayerState.START_AUDIO_RECORDING) {
      try {
        setTimeout(startAudioRecording, 100);
      } catch (ex) {
        console.log(ex);
      }
    } else if (state === PlayerState.STOP_AUDIO_RECORDING) {
        try {
          stopAudioRecording();
        } catch (ex) {
          console.log(ex);
        }
    }
  }, [state]);

  if (videoOnly || videoWithAudio) {
    const recordButton =
        <AwesomeButtonCartman
          borderRadius={10}
          height={50}
          stretch={true}
          raiseLevel={5}
          type="secondary"
          onPress={() => {
            if (isMerging) {
              return;
            }

            let isStatePlaying = state === PlayerState.START_AUDIO_RECORDING;
            if (!isStatePlaying) {
              playerRef.seek(0);
            }
            setVideoPaused(isStatePlaying);

            let newState;
            if (state !== PlayerState.VIDEO_SAVED || PlayerState.START_AUDIO_RECORDING) {
              newState = PlayerState.VIDEO_SAVED;
            } else {
              newState = state;
            }
            updatePlayersState('state', newState);
          }}
          title="Record">
            <Text style={[styles.buttonFontStyle, styles.recVoiceText]}>REC VOICE</Text>
        </AwesomeButtonCartman>;

    const recordingInProgress =
        <AwesomeButtonCartman
          borderRadius={10}
          height={50}
          stretch={true}
          raiseLevel={5}
          type="disabled"
          disabled={true}
          title="Recording in progress">
            <Text style={[styles.buttonFontStyle, styles.recordingText]}>RECORDING</Text>
        </AwesomeButtonCartman>;

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
              textSize={30}
              width={isMerging ? 130 : 90}
              type={isMerging ? 'disabled' : 'anchor'}
              onPress={() => {

                if (state !== PlayerState.AUDIO_VIDEO_SAVED && state !==
                  PlayerState.VIDEO_SAVED) {
                  return;
                }

                if (!isMerging) {
                  setMerging(true);
                  mergeVideosAndUpdateUrl();
                }
            }}>
            { isMerging ?
            <Text style={[styles.buttonFontStyle, styles.mergeDisabledText]}>
            <FontAwesomeIcon
              icon={ faRedo }
              color={ '#c7e8ae' }
              size={20}
            /> MIXING..
            </Text>
            :
            <Text style={[styles.buttonFontStyle, styles.mergeText]}>
            <FontAwesomeIcon
              icon={ faCheckCircle }
              color={ '#34711f' }
              size={20}
            /> MIX
            </Text>
            }
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
          {state !== PlayerState.START_AUDIO_RECORDING ? recordButton : recordingInProgress}
        </View>

        <Modal isVisible={isModalVisible}>
          <View style={styles.infoBox}>
            <View style={styles.infoBoxContent}>
                <Text style={[styles.infoBoxTitleView, styles.infoBoxTitleText]}>Mixing error!</Text>
                <View style={{padding: 15}}>
                  <Text style={styles.infoBoxSubtitleText}> {missingAudiosMsg} </Text>
                  <View style={{alignItems: 'flex-end'}}>
                    <AwesomeButtonRick
                      borderRadius={50}
                      height={50}
                      textSize={30}
                      width={90}
                      type="anchor"
                      onPress={() => {
                        setMerging(false);
                        setIsModalVisible(!isModalVisible);
                      }}>
                      <Text style={[styles.buttonFontStyle, styles.okText]}>
                      <FontAwesomeIcon
                          icon={ faCheckCircle }
                          color={ '#34711f' }
                          size={20}
                      /> OK
                      </Text>
                  </AwesomeButtonRick>
                  </View>
                </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  } else {
    return (null);
  }

  async function mergeVideosAndUpdateUrl() {
    let merged_video = await mergeVideos(playersState);

    if (!merged_video) {
      let msg = 'You are missing audio for video ';
      if (playersState[0].videoWithAudio === '') {
        msg = msg.concat('1, ');
      }
      if (playersState[1].videoWithAudio === '') {
        msg = msg.concat('2, ');
      }
      if (playersState[2].videoWithAudio === '') {
        msg = msg.concat('3, ');
      }
      msg = msg.substring(0, msg.length - 2);
      setMissingAudiosMsg(msg);
      setIsModalVisible(true);
      return;
    }

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
  playButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: '10%',
  },
  buttonFontStyle: {
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'd puntillas D to tiptoe' : 'Dpuntillas-Regular',
  },
  mergeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  mergeText: {
    color: '#34711f',
  },
  mergeDisabledText: {
    color: '#c7e8ae',
  },
  recordingText: {
    color: 'gray',
  },
  recVoiceText: {
    color: '#e1dfe2',
  },
  infoBox: {
    flex: 1,
    justifyContent: 'center',
  },
  infoBoxContent: {
    backgroundColor: '#e1dfe2',
    justifyContent: 'center',
    borderRadius: 7,
    borderColor: '#ffc200',
    borderWidth: 5,
  },
  infoBoxTitleView: {
    backgroundColor: '#ee3355',
    color:'#ffc200',
    borderColor: '#ffc200',
    borderRadius: 7,
    padding: 10,
  },
  infoBoxTitleText: {
    fontSize: 25,
    color:'#e1dfe2',
    fontFamily: Platform.OS === 'ios' ? 'd puntillas D to tiptoe' : 'Dpuntillas-Regular',
  },
  infoBoxSubtitleText: {
    fontSize: 20,
    color:'#787878',
  },
  okText: {
    color: '#34711f',
  },
});
