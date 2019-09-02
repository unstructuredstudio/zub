/**
 * App.js
 * ======
 * 
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 * 
 */

import React, { Component, PureComponent } from 'react';
import { createStackNavigator, createAppContainer, Header } from 'react-navigation';
import VideoPlayer from './src/Player';
import PrimaryScreen from './src/PrimaryScreen';

const RootStack = createStackNavigator(
  {
    PrimaryScreen: PrimaryScreen, 
    Player: VideoPlayer,
  },
  {
    initialRouteName: 'PrimaryScreen',
  },
  { headerMode: 'none' }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
