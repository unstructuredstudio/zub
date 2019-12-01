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
} from 'react-native';
import AwesomeButtonCartman from 'react-native-really-awesome-button/src/themes/cartman';
import ScreenTitle from './ScreenTitle';


export default function PrimaryScreen(props) {
  const {navigate} = props.navigation;
  const [playersState, setPlayersState] = React.useState([
    {
      state: PlayerState.NONE,
      filePath: '',
      videoDuration: 0,
      button: '1',
      isActive: true,
    },
    {
      state: PlayerState.NONE,
      filePath: '',
      videoDuration: 0,
      button: '2',
      isActive: false,
    },
    {
      state: PlayerState.NONE,
      filePath: '',
      videoDuration: 0,
      button: '3',
      isActive: false,
    },
  ]);

  const [curScreenNum, setCurScreenNum] = React.useState(0),
    [zubVideoUrl, setZubVideoUrl] = React.useState(''),
    buttonElements = [];

  const switchScreenFn = index => () => switchScreen(index);

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
          type={playersState[i].isActive ? 'primary' : 'disabled'}
          onPress={switchScreenFn(i)}
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
        newState = PlayerState.RECORDING;
        break;

      case PlayerState.RECORDING:
        newState = PlayerState.PREVIEW;
        break;

      case PlayerState.PREVIEW:
        newState = PlayerState.PLAYING;
        break;

      case PlayerState.PLAYING:
        newState = PlayerState.SAVED;
        break;

      default:
        newState = PlayerState.NONE;
    }
    return newState;
  };

  const updatePlayersState = (key, value) => {
    if (key === 'state') {
      playersState[curScreenNum].state = decideNextState(value);
    } else if (key === 'filePath') {
      playersState[curScreenNum].filePath = value;
    } else if (key === 'videoDuration') {
      playersState[curScreenNum].videoDuration = value;
    }
    setPlayersState([...playersState]);
  };

  const updateZubVideoUrl = (url) => {
    setZubVideoUrl(url);
    navigate('ShareScreen', {zubVideoUrl: url});
  };

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
            />
          </View>
          { (playersState[curScreenNum].state === PlayerState.RECORDING ||
          playersState[curScreenNum].state === PlayerState.PLAYING) &&
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
                onPress={() => {
                  updatePlayersState('state', playersState[curScreenNum].state);
                }}>
                {
                  playersState[curScreenNum].state === PlayerState.RECORDING ? 'STOP' : 'RECORD'
                }
              </AwesomeButtonCartman>
            </View>
        </View>
      </View>
    </SafeAreaView>
    </Fragment>
  );

  function switchScreen(nextScreenNum) {
    if (nextScreenNum === curScreenNum) {
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
    backgroundColor: 'white',
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
  buttonText: {
    fontSize: 50,
    fontWeight: '700',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  body: {
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems:'flex-start',
    position: 'relative',
    display: 'flex',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
});
