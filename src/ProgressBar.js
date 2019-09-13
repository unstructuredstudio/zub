/**
 * ProgressBar.js
 * ================
 *
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 *
 */

import React from 'react';
import AnimatedBar from 'react-native-animated-bar';
import { StyleSheet, View, Text } from 'react-native';

export default function ProgressBar(props) {
  const [maxClipSize] = React.useState(40);
  const [count, setCount] = React.useState(0);
  const { recording, setRecording } = props;

  React.useEffect(() => {
    let interval = null;

    if (recording && count < maxClipSize) {
      interval = setInterval(() => {
        setCount(count + 1);
      }, 1000);
    } else {
      setRecording(null);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [recording, count, maxClipSize, setRecording]);

  return (
    <View style={styles.progressBarContainer}>
      <AnimatedBar
        progress={count * 0.025}
        height={40}
        borderColor={'#edca31'}
        barColor={'#EE3253'}
        fillColor={'#edca31'}
        borderRadius={13}
        borderWidth={10}
        duration={count}
        animate={true}
      >
        <View style={styles.barContainer}>
          <View>
            {count > 0 && <Text style={styles.barText}>{count}s</Text>}
          </View>
          <View>
            {count !== 40 && <Text style={styles.barText}>{maxClipSize}s</Text>}
          </View>
        </View>
      </AnimatedBar>
    </View>
  );
}

const styles = StyleSheet.create({
  progressBarContainer: {
    flex: 0.1,
    backgroundColor: '#00B8C4',
    display: 'flex',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  barText: {
    backgroundColor: 'transparent',
    color: '#FFF',
  },
  barContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
});
