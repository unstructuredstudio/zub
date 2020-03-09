/**
 * ShareScreen.js
 * ================
 *
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 *
 */

import React, {Fragment} from 'react';
import {Platform} from 'react-native';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import Video from 'react-native-video';
import AwesomeButtonRick from
  'react-native-really-awesome-button/src/themes/rick';
import {FontAwesomeIcon} from
  '@fortawesome/react-native-fontawesome';
import {faDownload, faPlay, faChevronLeft, faPause, faRedo, faCheckCircle, faShare}
  from '@fortawesome/free-solid-svg-icons';
import {saveToCameraRoll} from './Utils';
import Modal from 'react-native-modal';
import {PlayerState} from './Constants';
import PropTypes from 'prop-types';
import DeviceInfo, { getUniqueId } from 'react-native-device-info';

/**
 * Screen that allows playing & saving the final recording
 * @param {object} props
 * @return {string}
 */
export default function ShareScreen(props) {
  const {navigate} = props.navigation;
  const [videoPaused, setVideoPaused] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const zubVideoUrl = props.navigation.getParam('zubVideoUrl');
  const playersState = props.navigation.getParam('playersState');

  // TODO: This is security by obscurity (bad!). Need to replace later on by pinned device certificates/user identity.
  // For production env, replace "ZUB" with unique/hidden env identifier added to DEVICE_INFO in Zub as well as ZubHub.
  var DEVICE_ID = 'ZUB:'+DeviceInfo.getUniqueId();

  /**
   * Resets player states
   * @param {object} states
   */
  function clearStates(states) {
    for (let i = 0; i < states.length; i++) {
      states[i].state = PlayerState.NONE;
      states[i].videoOnly = '';
      states[i].videoDuration = 0;
      if (i === 0) {
        states[i].isActive = true;
      } else {
        states[i].isActive = false;
      }
    }
    console.log('Zub screen states reset to default');
  }

  return (
    <Fragment>
      <SafeAreaView flex={1}>
        <View style={styles.container}>
          <View style={styles.videoContainer}>
            <Video
              source={{uri: zubVideoUrl}}
              style={styles.backgroundVideo}
              resizeMode="cover"
              paused={videoPaused}
              repeat={true}
              onEnd={() => {
                setVideoPaused(!videoPaused);
              }}
            />
            <View style={styles.backButton}>
              <AwesomeButtonRick
                borderRadius={50}
                textSize={30}
                height={50}
                stretch={true}
                type="secondary"
                onPress={() => {
                  navigate('PrimaryScreen', {playersState: playersState});
                }}
                title="Back"
              >
                <FontAwesomeIcon
                  icon={ faChevronLeft }
                  color={ '#349890' }
                />
              </AwesomeButtonRick>
            </View>
            <View style={styles.playButton}>
              <AwesomeButtonRick
                borderRadius={50}
                height={50}
                textSize={30}
                stretch={true}
                type="secondary"
                onPress={() => {
                  setVideoPaused(!videoPaused);
                }}
              >
                { videoPaused ?
                                <FontAwesomeIcon
                                  icon={ faPlay }
                                  color={ '#349890' }
                                /> :
                                <FontAwesomeIcon
                                  icon={ faPause }
                                  color={ '#349890' }
                                />
                }
              </AwesomeButtonRick>
            </View>
            <View style={styles.downloadButton}>
              <AwesomeButtonRick
                borderRadius={50}
                height={50}
                textSize={30}
                width={isSaving ? 150 : 110}
                type={isSaving ? 'disabled' : 'anchor'}
                onPress={() => {
                  if (!isSaving) {
                    setIsSaving(true);
                    if (saveToCameraRoll(zubVideoUrl)) {
                      setIsSaving(false);
                      setIsModalVisible(!isModalVisible);
                      clearStates(playersState);
                    }
                  }
                }}
                title="Save">
                { isSaving ?
                <Text style={[styles.buttonFontStyle, styles.saveDisabledText]}>
                  SAVING... </Text> :
                <Text style={[styles.buttonFontStyle, styles.saveText]}>
                  SAVE </Text>
                }
                { isSaving ?
                  <FontAwesomeIcon
                    icon={ faRedo }
                    color={ '#c7e8ae' }
                    size={20}
                  /> :
                  <FontAwesomeIcon
                    icon={ faDownload }
                    color={ '#34711f' }
                    size={20}
                  />
                }
              </AwesomeButtonRick>
            </View>
            <View style={styles.shareButton}>
              <AwesomeButtonRick
                borderRadius={50}
                height={50}
                textSize={30}
                width={250}
                type={'anchor'}
                onPress={() => {
                  // TODO: Complete the Uploade API Process
                  // 1. First Fetch upload token via API call to /api/uploadToken
                  // 2. Make API call to Vimeo to upload video
                  fetch('http://localhost:5000/api/uploadToken/'+DEVICE_ID)
                    .then((res) => res.json())
                    .then((responseJson) => {
                      console.log(responseJson);
                      // Make Vimeo API calls to upload
                      console.log("Uploading...")
                    })
                    .catch((error) => {
                      console.error(error);
                  });
                }}
                title="Share">
                { 
                <Text style={[styles.buttonFontStyle, styles.saveText]}>
                  Share on ZubHub </Text>
                }
                {
                  <FontAwesomeIcon
                    icon={ faShare }
                    color={ '#34711f' }
                    size={20}
                  />
                }
              </AwesomeButtonRick>
            </View>
          </View>
          <Modal isVisible={isModalVisible}>
            <View style={styles.infoBox}>
              <View style={styles.infoBoxContent}>
                <Text style={[styles.infoBoxTitleView,
                  styles.infoBoxTitleText]}>Video saved!</Text>
                <View style={styles.infoBoxView}>
                  <Text style={styles.infoBoxSubtitleText}>
                  You can view the saved video in your phone gallery. </Text>
                  <View style={styles.infoBoxBody}>
                    <AwesomeButtonRick
                      borderRadius={50}
                      height={50}
                      textSize={30}
                      width={90}
                      type="anchor"
                      onPress={() => {
                        setIsSaving(false);
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
      </SafeAreaView>
    </Fragment>
  );
}

ShareScreen.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: '#00B8C4',
    borderWidth: 10,
    backgroundColor: '#00B8C4',
  },
  backgroundVideo: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: 'black',
  },
  videoContainer: {
    flex: 1,
  },
  buttonFontStyle: {
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ?
    'd puntillas D to tiptoe' : 'Dpuntillas-Regular',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: '10%',
  },
  playButton: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: '10%',
  },
  
  shareButton: {
    position: 'absolute',
    bottom: 10,
    right: 20,
  },

  downloadButton: {
    position: 'absolute',
    bottom: 70,
    right: 20,
  },
  saveText: {
    color: '#34711f',
  },
  saveDisabledText: {
    color: '#c7e8ae',
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
    color: '#ffc200',
    borderColor: '#ffc200',
    borderRadius: 7,
    padding: 10,
  },
  infoBoxTitleText: {
    fontSize: 25,
    color: '#e1dfe2',
    fontFamily: Platform.OS === 'ios' ?
    'd puntillas D to tiptoe' : 'Dpuntillas-Regular',
  },
  infoBoxSubtitleText: {
    fontSize: 20,
    color: '#787878',
  },
  infoBoxView: {
    padding: 15,
  },
  infoBoxBody: {
    alignItems: 'flex-end',
  },
  okText: {
    color: '#34711f',
  },
});

ShareScreen.navigationOptions = () => ({
  header: null,
});
