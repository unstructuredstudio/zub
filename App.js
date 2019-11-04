/**
 * App.js
 * ======
 *
 * (C) 2019 Unstructured.Studio <http://unstrucured.studio>
 *
 */

import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import VideoPlayer from './src/Player';
import PrimaryScreen from './src/PrimaryScreen';
import ShareScreen from './src/ShareScreen';

const RootStack = createStackNavigator(
  {
    PrimaryScreen: PrimaryScreen,
    Player: VideoPlayer,
    ShareScreen: ShareScreen,
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
