/**
 * PrimaryScreen.js
 * ================
 *
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 *
 */

import React, { Fragment } from 'react';
import VideoRecorder from './Camera';
import ProgressBar from './ProgressBar';
import { PlayerState } from './Constants';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text
} from 'react-native';
import AwesomeButtonCartman from 'react-native-really-awesome-button/src/themes/cartman';
import ScreenTitle from './ScreenTitle';


export default function PrimaryScreen(props) {
  const {navigate} = props.navigation;
  const [playersState, setPlayersState] = React.useState([
    {
      state: PlayerState.NONE,
      videoOnly: '',
      videoWithAudio: '',
      videoDuration: 0,
      button: '1',
      isActive: true,
    },
    {
      state: PlayerState.NONE,
      videoOnly: '',
      videoWithAudio: '',
      videoDuration: 0,
      button: '2',
      isActive: false,
    },
    {
      state: PlayerState.NONE,
      videoOnly: '',
      videoWithAudio: '',
      videoDuration: 0,
      button: '3',
      isActive: false,
    },
  ]);

  const [curScreenNum, setCurScreenNum] = React.useState(0),
    [zubVideoUrl, setZubVideoUrl] = React.useState(''),
    buttonElements = [],
    [isMerging, setMerging] = React.useState(false);

  const switchScreenFn = index => () => switchScreen(index);

  let isRecording, isAudiorecording = false;
  for(let index = 0; index < playersState.length; index += 1) {
    const state = playersState[index];
    if(state.state === PlayerState.START_AUDIO_RECORDING) {
      isRecording = true;
      isAudiorecording = true;
      break;
    } else if(state.state === PlayerState.START_VIDEO_RECORDING) {
      isRecording = true;
    }
  }

  for (let i = 0; i < playersState.length; i++) {
    buttonElements.push(
      <View key={'view_' + i} style={styles.videoButtonContainer}>
        <AwesomeButtonCartman
          key={'button_' + i}
          borderRadius={playersState[i].isActive ? 0 : 5}
          borderWidth={0}
          height={100}
          textSize={50}
          stretch={true}
          // disable all buttons except the current screen
          disabled={i == curScreenNum ? false: isRecording}
          type={playersState[i].isActive ? 'primary' : 'disabled'}
          onPress={isRecording ? null : switchScreenFn(i)}
        >
          {playersState[i].button}
        </AwesomeButtonCartman>
      </View>
    );
  }
  const decideNextState = (state) => {
    let newState;
    switch (state) {
      case PlayerState.NONE:
        newState = PlayerState.START_VIDEO_RECORDING;
        break;

      case PlayerState.START_VIDEO_RECORDING:
        newState = PlayerState.VIDEO_SAVED;
        break;

      case PlayerState.VIDEO_SAVED:
        newState = PlayerState.START_AUDIO_RECORDING;
        break;

      case PlayerState.START_AUDIO_RECORDING:
        newState = PlayerState.STOP_AUDIO_RECORDING;
        break;
        
      case PlayerState.STOP_AUDIO_RECORDING:
        newState = PlayerState.AUDIO_VIDEO_SAVED;
        break;
      
      default:
        newState = PlayerState.NONE;
    }
    return newState;
  };

  const updatePlayersState = (key, value) => {
    if (key === 'state') {
      playersState[curScreenNum].state = decideNextState(value);
    } else if (key === 'videoOnly') {
      playersState[curScreenNum].videoOnly = value;
    } else if (key === 'videoWithAudio') {
      playersState[curScreenNum].videoWithAudio = value;
    } else if (key === 'videoDuration') {
      playersState[curScreenNum].videoDuration = value;
    }
    setPlayersState([...playersState]);
  };

  const updateZubVideoUrl = (url) => {
    setZubVideoUrl(url);
    navigate('ShareScreen', {zubVideoUrl: url, playersState: playersState});
    setMerging(false);
  };

  // FOR DEBUG 
  // console.table(playersState)

  let recordText = <Text style={styles.recordButtonText}>REC</Text>
  let stopText = <Text style={styles.recordButtonText}>Stop</Text>  

  return (
    <Fragment>
    <SafeAreaView flex={1}>
      <ScreenTitle
        curScreenNum={curScreenNum}
      />
      <View style={styles.container}>
        <View style={styles.containerLeft}>
          <View style={styles.video}>
            <VideoRecorder
              playersState={playersState}
              curScreenNum={curScreenNum}
              updateZubVideoUrl={updateZubVideoUrl}
              updatePlayersState={updatePlayersState}
              isMerging={isMerging}
              setMerging={setMerging}
            />
          </View>
          { (playersState[curScreenNum].state === PlayerState.START_VIDEO_RECORDING ||
          playersState[curScreenNum].state === PlayerState.START_AUDIO_RECORDING) &&
          <ProgressBar
            playersState={playersState}
            curScreenNum={curScreenNum}
            updateZubVideoUrl={updateZubVideoUrl}
            updatePlayersState={updatePlayersState}
          />
          }
        </View>
        <View style={styles.containerRight}>
          {buttonElements}
            <View style={styles.recordButtonContainer}>
              <AwesomeButtonCartman
                borderRadius={50}
                height={100}
                stretch={true}
                type="secondary"
                disabled={isAudiorecording}
                onPress={() => {
                  if(isMerging) {
                    return;
                  }
                  let newState;
                  if(playersState[curScreenNum].state === (PlayerState.START_VIDEO_RECORDING || PlayerState.NONE)) {
                    newState = playersState[curScreenNum].state;
                  } else {
                    newState = PlayerState.NONE;
                  }
                  updatePlayersState('state', newState);
                }}>
                {
                  playersState[curScreenNum].state === PlayerState.START_VIDEO_RECORDING ? stopText : recordText
                }
              </AwesomeButtonCartman>
            </View>
        </View>
      </View>
    </SafeAreaView>
    </Fragment>
  );

  function switchScreen(nextScreenNum) {
    if (nextScreenNum === curScreenNum || isMerging) {
      return;
    }
    playersState[curScreenNum].isActive = false;
    playersState[nextScreenNum].isActive = true;
    setPlayersState(playersState);
    setCurScreenNum(nextScreenNum);
  }
}

// Remove Navigation Header
PrimaryScreen.navigationOptions = { header: null };

const styles = StyleSheet.create({
  recordButtonContainer: {
    flex: 1,
    flexGrow: 1,
    padding: 10,
    backgroundColor: 'gray',
  },
  videoButtonContainer: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: 'gray',
  },
  video: {
    flex: 1,
    borderColor: '#00B8C4',
    borderWidth: 10,
    borderRadius: 20,
    backgroundColor: 'black',
    display: 'flex',
  },
  containerRight: {
    flexDirection: 'column',
    flex: 0.15,
    backgroundColor: 'transparent',
    display: 'flex',
  },
  containerLeft: {
    flexDirection: 'column',
    flex: 0.85,
    display: 'flex',
    backgroundColor: '#00B8C4',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems:'flex-start',
    position: 'relative',
    display: 'flex',
  },
  recordButtonText: {
    fontSize: 25,
    color:'#e1dfe2',
    fontFamily: Platform.OS === "ios" ? 'd puntillas D to tiptoe': 'Dpuntillas-Regular',
  },
});
