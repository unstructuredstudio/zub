/**
 * Player.js
 * =========
 *
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 *
 */

import React from 'react';
import {StyleSheet, View, Platform, Text} from 'react-native';
import Video from 'react-native-video';
import {PlayerState} from './Constants';
import AwesomeButtonRick from
  'react-native-really-awesome-button/src/themes/rick';
import {mergeVideos} from './Utils';
import {FontAwesomeIcon} from
  '@fortawesome/react-native-fontawesome';
import {faPlay, faPause, faCheckCircle, faRedo, faAngleRight}
  from '@fortawesome/free-solid-svg-icons';

/**
 * Renders video player controls
 * @param {object} props
 * @return {string}
 */
export default function VideoPlayer(props) {
  const {curScreenNum, updatePlayersState, playersState, updateZubVideoUrl,
    isMerging, setMerging, setCurScreenNum} = props;

  const state = playersState[curScreenNum].state;
  const [videoPaused, setVideoPaused] = React.useState(true);
  const videoOnly = playersState[curScreenNum].videoOnly;

  if (videoOnly) {
    return (
      <View style={styles.videoContainer}>
        <Video
          source={{uri: videoOnly}}
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
          playersState[0].videoOnly !== '' &&
          playersState[1].videoOnly !== '' &&
          playersState[2].videoOnly !== '' &&
          <View style={styles.mergeButton}>
            <AwesomeButtonRick
              borderRadius={50}
              height={50}
              textSize={30}
              width={isMerging ? 130 : 90}
              type={isMerging ? 'disabled' : 'anchor'}
              onPress={() => {
                if (state !== PlayerState.VIDEO_SAVED) {
                  return;
                }

                if (!isMerging) {
                  setMerging(true);
                  mergeVideosAndUpdateUrl();
                }
              }}>
              { isMerging ?
              <Text style={[styles.buttonFontStyle, styles.mergeDisabledText]}>
                MIXING..
              </Text> :
              <Text style={[styles.buttonFontStyle, styles.mergeText]}>
                MIX
              </Text>
              }
              { isMerging ?
              <FontAwesomeIcon
                icon={ faRedo }
                color={ '#c7e8ae' }
                size={20}
              /> :
              <FontAwesomeIcon
                icon={ faCheckCircle }
                color={ '#34711f' }
                size={20}
              />
              }
            </AwesomeButtonRick>
          </View>
        }

        {
          (playersState[0].videoOnly !== '' || playersState[1].videoOnly !== ''
          || playersState[2].videoOnly !== '') &&
            !(playersState[0].videoOnly !== '' &&
            playersState[1].videoOnly !== '' &&
            playersState[2].videoOnly !== '') &&
          <View style={styles.nextButton}>
            <AwesomeButtonRick
            borderRadius={50}
            textSize={50}
            stretch={true}
            type="anchor"
            onPress={() => {
              switchScreen();
            }}>
            <Text style={[styles.buttonFontStyle, styles.mergeText]}>NEXT</Text>
            <FontAwesomeIcon
              icon={ faAngleRight }
              color={ '#34711f' }
              size={20}
            />
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
      </View>
    );
  } else {
    return (null);
  }

  /**
   * Merges all the videos and saves the url to a variable
   */
  async function mergeVideosAndUpdateUrl() {
    const mergedVideo = await mergeVideos(playersState);
    if (mergedVideo) {
      updateZubVideoUrl(mergedVideo);
    }
  }

  function switchScreen() {
    let nextScreenNum;
    if (curScreenNum === 0 || curScreenNum === 1) {
      nextScreenNum = curScreenNum + 1;
    } else if (curScreenNum === 2) {
      nextScreenNum = 0;
    }
    playersState[curScreenNum].isActive = false;
    playersState[nextScreenNum].isActive = true;
    updatePlayersState(playersState);
    setCurScreenNum(nextScreenNum);
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
  nextButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: '20%',
  },
  buttonFontStyle: {
    fontSize: 20,
    fontFamily: Platform.OS ===
      'ios' ? 'd puntillas D to tiptoe' : 'Dpuntillas-Regular',
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
});
