/**
 * PrimaryScreen.js
 * ================
 * 
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 * 
 */

import React, {Component, Fragment} from 'react';
import Video from 'react-native-video';
import VideoRecorder from './Camera';
import ProgressBar from './ProgressBar';
import {
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import AwesomeButtonCartman from 'react-native-really-awesome-button/src/themes/cartman';

export default function PrimaryScreen(props) {
  const [recording, setRecording] = React.useState(null);
  const [processing, setProcessing] = React.useState(false);

        return (
            <Fragment>
            <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.container}>
                    <View style={styles.containerLeft}>
                        <View style={styles.video}>
                            <VideoRecorder
                              recording={recording}
                              setRecording={setRecording}
                              processing={processing}
                              setProcessing={setProcessing}
                            />
                        </View>
                        <ProgressBar
                          recording={recording}
                          setRecording={setRecording}
                        />
                    </View>
                    <View style={styles.containerRight}>
                        <View style={styles.videoButtonContainer}>
                        <AwesomeButtonCartman 
                            borderRadius={0} 
                            borderWidth={0} 
                            height={100} 
                            textFontFamily={'RoundyRainbows'} 
                            textSize={50} 
                            stretch={true} 
                            type="primary"

                            onPress={() => {
                            this._button1.setNativeProps({type: "disabled"});
                            }}
                            >
                            1
                        </AwesomeButtonCartman>
                        </View>
                        <View style={styles.videoButtonContainer}
                            ref={component => this._button1 = component}
                        >
                            <AwesomeButtonCartman borderRadius={5} height={100} stretch={true}  textSize={50}  type="disabled">2</AwesomeButtonCartman>
                        </View>
                        <View style={styles.videoButtonContainer}>
                            <AwesomeButtonCartman borderRadius={5} height={100} stretch={true}  textSize={50}  type="disabled">3</AwesomeButtonCartman>
                        </View>
                        <View style={styles.recordButtonContainer}>
                        <AwesomeButtonCartman 
                          borderRadius={50} 
                          height={100} 
                          stretch={true} 
                          type="secondary"
                          onPress={() => setRecording(!recording)}
                        >
                        {
                          recording ? 'STOP': 'RECORD'
                        }
                        </AwesomeButtonCartman>
                        </View>
                    </View>
                    </View>
            </SafeAreaView>
            </Fragment>
        );
}

// Remove Navigation Header
PrimaryScreen.navigationOptions = { header: null };

const styles = StyleSheet.create({
  recordButtonContainer: {
    flex: 1,
    flexGrow: 1,
    padding:10, 
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
    fontSize: 60,
    fontFamily: 'RoundyRainbows',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  body: {
    backgroundColor: "#ffffff",
    display: 'flex',
    flexDirection: 'column'
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
    color: "#000000",
  },
});
