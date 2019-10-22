/**
 * Player.js
 * =========
 *
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 *
 */

import React from 'react';
import { StyleSheet, View, Platform} from 'react-native';
import Video from 'react-native-video';
import SoundRecorder from 'react-native-sound-recorder';
import { RNFFmpeg } from 'react-native-ffmpeg';
import { PlayerState } from './Constants';
import RNFS from 'react-native-fs';
import AwesomeButtonCartman from 'react-native-really-awesome-button/src/themes/cartman';
import {requestMicPermission, deleteMediaFile } from './Utils';

export default function VideoPlayer(props) {
  const { fileNum, fileUri, state, updateState, videoDuration,
    updateVideoDuration } = props;

  React.useEffect(() => {
    async function startAudioRecording() {
      if (Platform.OS === 'android') {
        await requestMicPermission();
      }

      // We need to specify audio codec as AAC for audio in Android
      let options = {
        encoder: 3,    // AAC (https://developer.android.com/reference/android/media/MediaRecorder.AudioEncoder#AAC)
      };

      await SoundRecorder.start(RNFS.CachesDirectoryPath + '/audio_' + fileNum + '.mp4', options)
      .then(function() {
        console.log('Started Audio Recording');
      });
    }

    async function stopAudioRecording() {
      const destPath = RNFS.CachesDirectoryPath + '/output_' + fileNum + '.mp4';
      await deleteMediaFile(destPath);

      await SoundRecorder.stop()
      .then(function(audio) {
        console.log('Stopped audio recording, audio file saved at: ' + audio.path);

        //Combine audio and video
        RNFFmpeg.execute('-i ' + fileUri + ' -i ' + audio.path + ' -c copy ' + destPath, ' ')
        .then(media => console.log('FFmpeg process exited with rc ' + media.rc));
      }).catch(function(error) {
        console.log('An error occured while stoping the recording: ' + error);
      });
    }

    if (state === PlayerState.PLAYING) {
      try {
        setTimeout(startAudioRecording, 100);
      } catch (ex) {
        console.log(ex);
      }
    } else if (state === PlayerState.SAVED) {
      try {
        stopAudioRecording();
      } catch (ex) {
        console.log(ex);
      }
    }

    return stopAudioRecording;
  }, [state, updateState, videoDuration, updateVideoDuration]);

  return (
    <View style={styles.videoContainer}>
      <Video
        source={{ uri: fileUri }}
        // TODO: We will use this eventually, keeping them here so we remember ;-)
        // ref={(ref) => {
        //   this.player = ref;
        // }}
        // onBuffer={this.onBuffer}                // Callback when remote video is buffering
        // onEnd={this.onEnd}                      // Callback when playback finishes
        // onError={this.videoError}
        muted={false}
        style={styles.backgroundVideo}
        onLoad={(data) => {
          updateVideoDuration(Math.round(data.duration));
        }}
      />
        <View style={styles.box}>
        <AwesomeButtonCartman
          borderRadius={10}
          height={50}
          stretch={true}
          raiseLevel={5}
          type="secondary"
          onPress={() => {
            let newState = state === PlayerState.PLAYING ? PlayerState.SAVED : PlayerState.PLAYING;
            updateState(newState);
          }}
          title="Record">
          {
            state === PlayerState.PLAYING ? 'Stop ■' : 'Record Audio ⬤'
          }
          </AwesomeButtonCartman>
        </View>
    </View>
  );
}

export async function mergeVideos() {
  console.log('Merging videos...');

  let cacheDir = RNFS.CachesDirectoryPath,
    output_0 = cacheDir + '/output_0.mp4',
    output_1 = cacheDir + '/output_1.mp4',
    output_2 = cacheDir + '/output_2.mp4',
    im_0 = cacheDir + '/im_0.ts',
    im_1 = cacheDir + '/im_1.ts',
    im_2 = cacheDir + '/im_2.ts',
    zub_vid = cacheDir + '/zub_video.mp4',
    ff_trans_cmd = ' -c copy -bsf:v h264_mp4toannexb -f mpegts ',
    ff_con_cmd = ' -c copy -bsf:a aac_adtstoasc ';

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
  await RNFFmpeg.execute('-i ' + output_0 + ff_trans_cmd + im_0)
  .then(media_0 => console.log(media_0.rc));

  await RNFFmpeg.execute('-i ' + output_1 + ff_trans_cmd + im_1)
  .then(media_1 => console.log(media_1.rc));

  await RNFFmpeg.execute('-i ' + output_2 + ff_trans_cmd + im_2)
  .then(media_2 => console.log(media_2.rc));

  await RNFFmpeg.execute('-i concat:' + im_0 + '|' + im_1 + '|' + im_2 + ff_con_cmd + zub_vid)
  .then(media_zub => console.log(media_zub.rc));

}

const styles = StyleSheet.create({
  backgroundVideo: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexGrow: 1,
  },
  videoContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
    overflow: 'hidden', // Needed for Android
    borderRadius: 10,
  },
  box: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: '22%',
  },
});
