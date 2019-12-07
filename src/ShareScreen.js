/**
 * ShareScreen.js
 * ================
 *
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 *
 */

import React, { Fragment } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDownload, faPlay, faChevronLeft, faPause, faCheck } from '@fortawesome/free-solid-svg-icons';
import { saveToCameraRoll } from './Utils';

export default function ShareScreen(props) {
    const { navigate } = props.navigation,
        [ videoPaused, setVideoPaused ] = React.useState(true),
        [ isMediaSaved, setIsMediaSaved ] = React.useState(false);

    let zubVideoUrl = props.navigation.getParam('zubVideoUrl');

    return (
        <Fragment>
        <SafeAreaView flex={1}>
            <View style={styles.container}>
                <View style={styles.videoContainer}>
                    <Video
                        source={{ uri: zubVideoUrl }}
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
                            stretch={true}
                            type="secondary"
                            onPress={() => {
                                navigate('PrimaryScreen');
                            }}
                            title="Back">
                            <FontAwesomeIcon
                                icon={ faChevronLeft }
                                color={ '#349890' }
                            />
                        </AwesomeButtonRick>
                    </View>
                    <View style={styles.playButton}>
                        <AwesomeButtonRick
                            borderRadius={50}
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
                            textSize={30}
                            stretch={true}
                            type={isMediaSaved ? 'anchor' : 'secondary'}
                            onPress={() => {
                                if (saveToCameraRoll(zubVideoUrl)) {
                                    setIsMediaSaved(true);
                                }
                            }}
                            title="Save">
                            { isMediaSaved ?
                            <FontAwesomeIcon
                                icon={ faCheck }
                                color={ '#34711f' }
                                size={30}
                            /> :
                            <FontAwesomeIcon
                                icon={ faDownload }
                                color={ '#349890' }
                            />
                            }
                        </AwesomeButtonRick>
                    </View>
                </View>
            </View>
        </SafeAreaView>
        </Fragment>
    );
}

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
        backgroundColor: "black"
    },
    videoContainer: {
        flex: 1,
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
        right: 90,
        width: '10%',
    },
    downloadButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: '10%',
    },
});

ShareScreen.navigationOptions = () => ({
    header: null,
});
