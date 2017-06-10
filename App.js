import React from 'react';
import { NavigatorIOS } from 'react-native';
import Lists from './Lists';

export default class App extends React.Component {
  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: Lists,
          title: 'Mes listes',
        }}
        style={{flex: 1}}
      />
    );
  }
}
