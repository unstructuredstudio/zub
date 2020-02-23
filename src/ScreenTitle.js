/**
 * ScreenTitle.js
 * ================
 *
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 *
 */

import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import AwesomeButtonCartman from
  'react-native-really-awesome-button/src/themes/cartman';
import AwesomeButtonRick from
  'react-native-really-awesome-button/src/themes/rick';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faInfoCircle, faCheckCircle} from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-native-modal';
import {Platform} from 'react-native';
import PropTypes from 'prop-types';

/**
 * Renders screen titles and modals associated with each
 * @param {object} props
 * @return {string}
 */
export default function ScreenTitle(props) {
  const [title, setTitle] = React.useState('MOTIVATION');
  const {curScreenNum} = props;
  const infoTitle = [
    'How did you start?',
    'What materials did you use?',
    'How did you make it?',
  ];

  React.useEffect(() => {
    if (curScreenNum === 0) {
      setTitle('MOTIVATION');
    }

    if (curScreenNum === 1) {
      setTitle('MATERIALS');
    }

    if (curScreenNum === 2) {
      setTitle('MAKING');
    }
  }, [title, curScreenNum]);

  // For modal
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  // This elaborate hack of using a button with a button is
  // required because normal 'absolute' position 'box' styled
  // View is disappearing when backgroundColor is used
  return (
    <View style={styles.titleBox}>
      <AwesomeButtonCartman
        borderRadius={15}
        borderWidth={10}
        borderColor="#00B8C4"
        stretch={true}
        raiseLevel={0}
        height={70}
        type="disabled"
        title="dummy"
        ExtraContent={
          <AwesomeButtonCartman
            borderRadius={7}
            height={50}
            stretch={true}
            raiseLevel={4}
            type="secondary"
            onPress={() => {
              setIsModalVisible(true);
            }}
            title="screen title">
            <Text style={[styles.infoBoxTitleText]}>{title} </Text>
            <FontAwesomeIcon
              icon={ faInfoCircle }
              color={ '#ffc200' }
              size={20}
            />
          </AwesomeButtonCartman>
        }
      >
        <Text />
      </AwesomeButtonCartman>

      <Modal isVisible={isModalVisible}>
        <View style={styles.infoBox}>
          <View style={styles.infoBoxContent}>
            <Text style={[styles.infoBoxTitleView,
              styles.infoBoxTitleText]}>{infoTitle[curScreenNum]}</Text>
            <View style={styles.infoBoxView}>
              {curScreenNum === 0 &&
              <Text style={styles.infoBoxSubtitleText}>
              Introduce your project and motivation behind it in the first clip!
              </Text>
              }

              {curScreenNum === 1 &&
                <Text style={styles.infoBoxSubtitleText}>
                Share the types of materials and tools used in the second clip!
                </Text>
              }

              {curScreenNum === 2 &&
                <Text style={styles.infoBoxSubtitleText}>
                Highlight your making process and fun moments in the third clip!
                </Text>
              }

              <Text style={styles.infoBoxText}>NOTE: Use the
                <Image style={styles.videoButtonImage}
                  source={require('../images/video-button.png')} />
                  button to record the video first, then &nbsp;
                <Image style={styles.audioButtonImage}
                  source={require('../images/audio-button.png')} />
                  &nbsp; button to voice over it.
              </Text>

              <View style={styles.infoBoxBody}>
                <AwesomeButtonRick
                  borderRadius={50}
                  height={50}
                  textSize={20}
                  width={90}
                  type="anchor"
                  onPress={() => {
                    setIsModalVisible(!isModalVisible);
                  }}>
                  <Text style={[styles.okText]}>
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
}

ScreenTitle.propTypes = {
  curScreenNum: PropTypes.number,
};

const styles = StyleSheet.create({
  titleBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '32%',
    zIndex: 2,
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
  infoBoxView: {
    padding: 15,
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
    fontFamily: Platform.OS ===
      'ios' ? 'd puntillas D to tiptoe' : 'Dpuntillas-Regular',
  },
  infoBoxSubtitleText: {
    fontSize: 22,
    color: '#787878',
  },
  infoBoxBody: {
    alignItems: 'flex-end',
  },
  infoBoxText: {
    fontSize: 20,
    color: '#787878',
  },
  videoButtonImage: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  audioButtonImage: {
    height: 30,
    width: 70,
    resizeMode: 'contain',
  },
  okText: {
    color: '#34711f',
    fontSize: 20,
    fontFamily: Platform.OS ===
      'ios' ? 'd puntillas D to tiptoe' : 'Dpuntillas-Regular',
  },
});
