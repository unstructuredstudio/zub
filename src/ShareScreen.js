/**
 * ShareScreen.js
 * ================
 *
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 *
 */

import React, { Fragment } from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import Video from 'react-native-video';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDownload, faPlay, faChevronLeft, faPause, faRedo, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { saveToCameraRoll } from './Utils';
import Modal from 'react-native-modal';
import { PlayerState } from './Constants';

export default function ShareScreen(props) {
    const { navigate } = props.navigation,
        [ videoPaused, setVideoPaused ] = React.useState(true),
        [ isSaving, setIsSaving ] = React.useState(false),
        [ isModalVisible, setIsModalVisible ] = React.useState(false);

    let zubVideoUrl = props.navigation.getParam('zubVideoUrl');
    const playersState = props.navigation.getParam('playersState');

    // Set States to default
    function clearStates(playersState) {
        for (let i = 0; i < playersState.length; i++) {
            playersState[i].state = PlayerState.NONE;
            playersState[i].videoOnly = '';
            playersState[i].videoWithAudio = '';
            playersState[i].videoDuration = 0;
            if (i == 0) {
                playersState[i].isActive = true;
            } else {
                playersState[i].isActive = false;
            }
        }
        console.log("Zub screen states reset to default")
    }

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
                                height={50}
                                stretch={true}
                                type="secondary"
                                onPress={() => {
                                    navigate('PrimaryScreen', {playersState: playersState});
                                }}
                                title="Back"
                            >
                                <FontAwesomeIcon
                                    icon={ faChevronLeft }
                                    color={ '#349890' }
                                />
                            </AwesomeButtonRick>
                        </View>
                        <View style={styles.playButton}>
                            <AwesomeButtonRick
                                borderRadius={50}
                                height={50}
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
                                height={50}
                                textSize={30}
                                width={isSaving ? 150 : 110}
                                type={isSaving ? 'disabled' : 'anchor'}
                                onPress={() => {
                                    if (!isSaving) {
                                        setIsSaving(true);
                                        if (saveToCameraRoll(zubVideoUrl)) {
                                            setIsSaving(false);
                                            setIsModalVisible(!isModalVisible);
                                            clearStates(playersState)
                                        }
                                    }
                                }}
                                title="Save">
                                { isSaving ?
                                <Text style={[styles.buttonFontStyle, styles.saveDisabledText]}>
                                <FontAwesomeIcon
                                    icon={ faRedo }
                                    color={ '#c7e8ae' }
                                    size={20}
                                /> SAVING... </Text> :
                                <Text style={[styles.buttonFontStyle, styles.saveText]}>
                                <FontAwesomeIcon
                                    icon={ faDownload }
                                    color={ '#34711f' }
                                    size={20}
                                /> SAVE
                                </Text>
                                }
                            </AwesomeButtonRick>
                        </View>
                    </View>
                    <Modal isVisible={isModalVisible}>
                        <View style={styles.infoBox}>
                            <View style={styles.infoBoxContent}>
                                <Text style={[styles.infoBoxTitleView, styles.infoBoxTitleText]}>Video saved!</Text>
                                <View style={{padding: 15}}>
                                    <Text style={styles.infoBoxSubtitleText}> You can view the saved video in your phone's gallery. </Text>
                                    <View style={{alignItems: 'flex-end'}}>
                                        <AwesomeButtonRick
                                        borderRadius={50}
                                        height={50}
                                        textSize={30}
                                        width={90}
                                        type="anchor"
                                        onPress={() => {
                                            setIsSaving(false);
                                            setIsModalVisible(!isModalVisible);
                                        }}>
                                        <Text style={[styles.buttonFontStyle, styles.okText]}>
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
        backgroundColor: 'black',
    },
    videoContainer: {
        flex: 1,
    },
    buttonFontStyle: {
        fontSize: 20,
        fontFamily: Platform.OS === 'ios' ? 'd puntillas D to tiptoe' : 'Dpuntillas-Regular',
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
        left: 10,
        width: '10%',
    },
    downloadButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    saveText: {
        color: '#34711f',
      },
    saveDisabledText: {
        color: '#c7e8ae',
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
    infoBoxTitleView: {
        backgroundColor: '#ee3355',
        color:'#ffc200',
        borderColor: '#ffc200',
        borderRadius: 7,
        padding: 10,
    },
    infoBoxTitleText: {
        fontSize: 25,
        color:'#e1dfe2',
        fontFamily: Platform.OS === 'ios' ? 'd puntillas D to tiptoe' : 'Dpuntillas-Regular',
    },
    infoBoxSubtitleText: {
        fontSize: 20,
        color:'#787878',
    },
    okText: {
        color: '#34711f',
    },
});

ShareScreen.navigationOptions = () => ({
    header: null,
});
