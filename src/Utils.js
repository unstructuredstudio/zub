/**
 * Utils.js
 * ========
 *
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 *
 */

import {PermissionsAndroid} from 'react-native';
import RNFS from 'react-native-fs';

export async function requestMicPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Zub Mic Permission',
        message:
          'Zub needs access to your microphone ' +
          'so you can record audio over the videos',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the mic');
    } else {
      console.log('Microphone permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

export async function deleteMediaFile(file) {
  const exists = await RNFS.exists(file);
  let promise = {};
  if (exists) {
    promise = await RNFS.unlink(file);
  }
  return promise;
}
