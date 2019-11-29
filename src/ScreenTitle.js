/**
 * ScreenTitle.js
 * ================
 *
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 *
 */

import React from 'react';
import AnimatedBar from 'react-native-animated-bar';
import { StyleSheet, View, Text } from 'react-native';
import { PlayerState } from './Constants';

import AwesomeButtonCartman from 'react-native-really-awesome-button/src/themes/cartman';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default function ScreenTitle(props) {
  const [title, setTitle] = React.useState("INTRO");
  const { curScreenNum } = props;

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

  // This elaborate hack of using a button with a button is 
  // required because normal 'absolute' position 'box' styled 
  // View is disappearing when backgroundColor is used
  return (
    <View style={styles.box}>
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
            // updatePlayersState('state', state);
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
  );
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '30%',
  },
});
