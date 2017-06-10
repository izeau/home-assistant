import React from 'react';
import { NavigatorIOS } from 'react-native';
import Lists from './Lists';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './redux';

const store = createStore(reducer);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <NavigatorIOS
          initialRoute={{
            component: Lists,
            title: 'Mes listes',
          }}
          style={{flex: 1}}
        />
      </Provider>
    );
  }
}
