/**
 * ScreenTitle.js
 * ================
 *
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 *
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import AwesomeButtonCartman from 'react-native-really-awesome-button/src/themes/cartman';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';


import Modal from "react-native-modal";


export default function ScreenTitle(props) {
  const [title, setTitle] = React.useState("INTRO");
  const { curScreenNum } = props;

  const infoText = [
    "In the first video clip...",
    "Info 2",
    "Info 3"
  ]

  const infoTitle = [
    "Introduce the project!",
    "What materials did you use?",
    "How did you build it?"
  ]

  React.useEffect(() => {
    if (curScreenNum === 0) {
      setTitle("INTRO");
    }

    if (curScreenNum === 1) {
      setTitle("MATERIALS");
    }

    if (curScreenNum === 2) {
      setTitle("MAKING");
    }

  }, [title, curScreenNum]);

  // For modal
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  // This elaborate hack of using a button with a button is 
  // required because normal 'absolute' position 'box' styled 
  // View is disappearing when backgroundColor is used
  return (
    <View>
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
              setIsModalVisible(true)
            }}
            title="screen title">
            <Text style={{fontWeight: 'bold', fontSize: 25, color:'#e1dfe2'}}>{title}   </Text>
            <FontAwesomeIcon
              icon={ faInfoCircle }
              color={ '#ffc200' }
              size={20}
            />
            </AwesomeButtonCartman>
          }
          >
          <Text></Text>
        </AwesomeButtonCartman>
      </View>

      <Modal isVisible={isModalVisible}>
          <View style={styles.infoBox}>
            <View style={styles.infoBoxContent}>
            <Text style={styles.infoBoxTitle}>{infoTitle[curScreenNum]}</Text>
              <View style={{padding: 15}}>
                <Text style={styles.infoBoxText}> {infoText[curScreenNum]} </Text>
                <View style={{alignItems: "flex-end"}}>
                  <AwesomeButtonRick
                    borderRadius={50}
                    height={50}
                    textSize={20}
                    width={90}
                    type="anchor"
                    onPress={() => {
                      setIsModalVisible(!isModalVisible)
                  }}>
                    Ok ✓
                  </AwesomeButtonRick>
                </View>
              </View>
            </View>
          </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  titleBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '30%',
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
    borderWidth: 5
  },
  infoBoxTitle: {
    backgroundColor: '#ee3355',
    fontWeight: 'bold', 
    color:'#ffc200',
    borderColor: '#ffc200',
    borderRadius: 7,
    padding: 10,
    fontSize: 22,
  },
  infoBoxText: {
    fontWeight: 'bold', 
    fontSize: 20, 
    color:'#787878',
  },
});
