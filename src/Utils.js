/**
 * Utils.js
 * ========
 *
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 *
 */

import {PermissionsAndroid, Platform} from 'react-native';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';
import {RNFFmpeg} from 'react-native-ffmpeg';

/**
 * Requests mic permission; for Android only
 */
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

/**
 * Requests storage permission; for Android only
 */
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

/**
 * Deletes a media file
 * @param {string} file
 * @return {promise} promise
 */
export async function deleteMediaFile(file) {
  const exists = await RNFS.exists(file);
  let promise = {};
  if (exists) {
    promise = await RNFS.unlink(file);
  }
  return promise;
}

/**
 * Moves a media file from one location to another
 * @param {string} filePath
 * @param {string} destPath
 * @return {promise} promise
 */
export async function moveMediaFile(filePath, destPath) {
  const exists = await RNFS.exists(filePath);
  let promise = {};
  if (exists) {
    promise = await RNFS.moveFile(filePath, destPath);
  }
  return promise;
}

/**
 * Saves a file to phones camera roll
 * @param {string} filePath
 * @return {promise} promise
 */
export async function saveToCameraRoll(filePath) {
  let promise = {};
  if (Platform.OS === 'android') {
    await requestStoragePermission();
  }
  promise = await CameraRoll.saveToCameraRoll(filePath, 'video');
  // Clean app cache after saving merged video to remove temporary files
  cleanCache();
  return promise;
}

/**
 * Cleans the cache directory
 */
function cleanCache() {
  RNFS.unlink(RNFS.CachesDirectoryPath)
      .then( () => {
        console.log('App cache cleaned');
      })
      .catch((err) => {
        console.log(err.message);
      });
}

/**
 * Merges all the videos to generate a single recording
 * @param {object} playersState
 * @return {string} output
 */
export async function mergeVideos(playersState) {
  console.log('Merging videos...');

  const cacheDir = RNFS.CachesDirectoryPath;
  const video0 = playersState[0].videoOnly;
  const video1 = playersState[1].videoOnly;
  const video2 = playersState[2].videoOnly;
  const im0 = cacheDir + '/im_0.ts';
  const im1 = cacheDir + '/im_1.ts';
  const im2 = cacheDir + '/im_2.ts';
  const zubVid = cacheDir + '/zub_video.mp4';
  const ffTransCmd = ' -c copy -bsf:v h264_mp4toannexb -f mpegts ';
  const ffConCmd = ' -c copy -bsf:a aac_adtstoasc ';
  let output = '';

  const promise1 = deleteMediaFile(zubVid);
  const promise2 = deleteMediaFile(im0);
  const promise3 = deleteMediaFile(im1);
  const promise4 = deleteMediaFile(im2);

  await Promise.all([promise1, promise2, promise3,
    promise4]).then(function(res) {
    console.log('Existing videos deleted ' + res);
  });

  /* Parallel execution is not possible right now with react-native-ffmpeg:
  * https://github.com/tanersener/react-native-ffmpeg/issues/87. When the
  * support is added, the FFMPEG executions below can be done in parallel
  * like the media file deletions above.
  */
  await RNFFmpeg.execute('-i ' + video0 + ffTransCmd + im0)
      .then((media0) => console.log(media0.rc));

  await RNFFmpeg.execute('-i ' + video1 + ffTransCmd + im1)
      .then((media1) => console.log(media1.rc));

  await RNFFmpeg.execute('-i ' + video2 + ffTransCmd + im2)
      .then((media2) => console.log(media2.rc));

  await RNFFmpeg.execute('-i concat:' + im0 + '|' +
    im1 + '|' + im2 + ffConCmd + zubVid)
      .then(function(mediaZub) {
        if (mediaZub.rc === 0) {
          output = zubVid;
        }
      });

  return output;
}

/**
 * Generates a six digit hash key
 * @return {string} result
 */
export function generateHash() {
  const length = 6;
  const chars =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  for (let i = length; i > 0; --i) {
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  }

  return result.toLowerCase();
}
