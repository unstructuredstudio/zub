/**
 * Utils.js
 * ========
 *
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 *
 */

import { PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';
import { RNFFmpeg } from 'react-native-ffmpeg';

// Required for Android
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

// Required for Android
async function requestStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Zub Storage Permission',
          message: 'Zub needs access to your storage ' +
            'so you can save the final video',
        },
      );
      return granted;
    } catch (err) {
      console.error('Failed to request permission ', err);
      return null;
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

export async function moveMediaFile(filePath, destPath) {
  const exists = await RNFS.exists(filePath);
  let promise = {};
  if (exists) {
    promise = await RNFS.moveFile(filePath, destPath);
  }
  return promise;
}

export async function saveToCameraRoll(filePath) {
  let promise = {};
  if (Platform.OS === 'android') {
    await requestStoragePermission();
  }
  promise = await CameraRoll.saveToCameraRoll(filePath, 'video');
  // Clean app cache after saving merged video to remove temporary files
  cleanCache()
  return promise;
}

function cleanCache(updatePlayerState) {
  RNFS.unlink(RNFS.CachesDirectoryPath)
  .then( () => {
      console.log("App cache cleaned")
  })
  .catch((err) => {
      console.log(err.message);
  });
}

export async function mergeVideos(playersState) {
  console.log('Merging videos...');

  let cacheDir = RNFS.CachesDirectoryPath,
    videoWithAudio_0 = playersState[0].videoWithAudio,
    videoWithAudio_1 = playersState[1].videoWithAudio,
    videoWithAudio_2 = playersState[2].videoWithAudio,
    video_0 = videoWithAudio_0 || playersState[0].videoOnly,
    video_1 = videoWithAudio_1 || playersState[1].videoOnly,
    video_2 = videoWithAudio_2 || playersState[2].videoOnly,
    im_0 = cacheDir + '/im_0.ts',
    im_1 = cacheDir + '/im_1.ts',
    im_2 = cacheDir + '/im_2.ts',
    zub_vid = cacheDir + '/zub_video.mp4',
    ff_trans_cmd = ' -c copy -bsf:v h264_mp4toannexb -f mpegts ',
    ff_con_cmd = ' -c copy -bsf:a aac_adtstoasc ',
    output = '';

  if (!(videoWithAudio_0 && videoWithAudio_1 && videoWithAudio_2) || (
    videoWithAudio_2 === '' && videoWithAudio_1 === '' && videoWithAudio_0 === ''
  )) {
    return output;
  }

  const promise1 = deleteMediaFile(zub_vid);
  const promise2 = deleteMediaFile(im_0);
  const promise3 = deleteMediaFile(im_1);
  const promise4 = deleteMediaFile(im_2);

  await Promise.all([promise1, promise2, promise3, promise4]).then(function(res) {
    console.log('Existing videos deleted ' + res);
  });

  /* Parallel execution is not possible right now with react-native-ffmpeg:
  * https://github.com/tanersener/react-native-ffmpeg/issues/87. When the
  * support is added, the FFMPEG executions below can be done in parallel
  * like the media file deletions above.
  */
  await RNFFmpeg.execute('-i ' + video_0 + ff_trans_cmd + im_0)
  .then(media_0 => console.log(media_0.rc));

  await RNFFmpeg.execute('-i ' + video_1 + ff_trans_cmd + im_1)
  .then(media_1 => console.log(media_1.rc));

  await RNFFmpeg.execute('-i ' + video_2 + ff_trans_cmd + im_2)
  .then(media_2 => console.log(media_2.rc));

  await RNFFmpeg.execute('-i concat:' + im_0 + '|' + im_1 + '|' + im_2 + ff_con_cmd + zub_vid)
  .then(function(media_zub) {
    if (media_zub.rc === 0) {
      output = zub_vid;
    }
  });

  return output;
}

export function generateHash() {
  let length = 6,
    chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    result = '';

  for (let i = length; i > 0; --i) {
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  }

  return result.toLowerCase();
}
