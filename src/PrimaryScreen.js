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
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import AwesomeButtonCartman from 'react-native-really-awesome-button/src/themes/cartman';

export default function PrimaryScreen(props) {
  const [recording, setRecording] = React.useState(null),
    [processing, setProcessing] = React.useState(false),
    [curScreenNum, setCurScreenNum] = React.useState(1),
    [nextScreenNum, setNextScreenNum] = React.useState(1),
    [workInProgress, SetWorkInProgress] = React.useState(false),
    [buttonTypes, setButtonTypes] = React.useState([
      { 'button': 1, type: 'primary' },
      { 'button': 2, type: 'disabled' },
      { 'button': 3, type: 'disabled' },
    ]),
    buttonElements = [];


  React.useEffect(() => {
    switchScreen();
  });

  for (let i = 0; i < 3; i++) {
    buttonElements.push(
      <View key={'view_' + i} style={styles.videoButtonContainer}>
        <AwesomeButtonCartman
          key={'button_' + i}
          borderRadius={buttonTypes[i].type === 'disabled' ? 5 : 0}
          borderWidth={0}
          height={100}
          textSize={50}
          stretch={true}
          type={buttonTypes[i].type}
          onPress={() => {
            setNextScreenNum(i + 1);
          }}
          >
          {(i + 1).toString()}
        </AwesomeButtonCartman>
      </View>
    );
  }

  return (
    <Fragment>
    <SafeAreaView flex={1}>
      <View style={styles.container}>
      <View style={styles.containerLeft}>
        <View style={styles.video}>
          <VideoRecorder
            recording={recording}
            setRecording={setRecording}
            processing={processing}
            setProcessing={setProcessing}
            curScreenNum={curScreenNum}
          />
        </View>
        <ProgressBar
          recording={recording}
          setRecording={setRecording}
        />
      </View>
      <View style={styles.containerRight}>
        {buttonElements}
        <View style={styles.recordButtonContainer}>
          <AwesomeButtonCartman
            borderRadius={50}
            height={100}
            stretch={true}
            type="secondary"
            onPress={() => setRecording(!recording)}
          >
          {
            recording ? 'STOP' : 'RECORD'
          }
          </AwesomeButtonCartman>
        </View>
      </View>
      </View>
    </SafeAreaView>
    </Fragment>
  );

  function switchScreen() {
    if (nextScreenNum === curScreenNum || workInProgress ||
      buttonTypes[nextScreenNum - 1].type === 'enabled') {
      return;
    }

    buttonTypes[curScreenNum - 1].type = 'disabled';
    buttonTypes[nextScreenNum - 1].type = 'primary';

    setButtonTypes(buttonTypes);
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
