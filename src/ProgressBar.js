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
import { PlayerState } from './Constants';

export default function ProgressBar(props) {
  const maxClipSize = 40;
  const [count, setCount] = React.useState(0);
  const { curScreenNum, playersState, updatePlayersState } = props;
  const [ clipSize, setClipSize ] = React.useState(maxClipSize);
  const videoDuration = playersState[curScreenNum].videoDuration,
    state = playersState[curScreenNum].state;

  React.useEffect(() => {
    let interval = null;

    if (state === PlayerState.NONE || state === PlayerState.PREVIEW) {
      setCount(0);
      setClipSize(maxClipSize);
    }

    if (state === PlayerState.PLAYING) {
      setClipSize(videoDuration);
    }

    if (state === PlayerState.RECORDING || state === PlayerState.PLAYING) {
      interval = setInterval(() => {
        if (count >= clipSize) {
          clearInterval(interval);
          updatePlayersState('state', state);
        } else {
          setCount(count + 1);
        }
      }, 1000);
    }

    return () => interval && clearInterval(interval);
  }, [count, clipSize]);

  return (
    <View style={styles.progressBarContainer}>
      <AnimatedBar
        progress={count / clipSize}
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
            {count !== clipSize && <Text style={styles.barText}>{clipSize}s</Text>}
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
