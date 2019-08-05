import React, { Component, PureComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Video from 'react-native-video';
import VideoRecorder from './src/Camera';
import VideoPlayer from './src/Player';

const RootStack = createStackNavigator(
  {
    Camera: VideoRecorder,
    Player: VideoPlayer,
  },
  {
    initialRouteName: 'Camera',
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
