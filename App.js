import React from 'react';
import { NavigatorIOS } from 'react-native';
import Lists from './Lists';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './redux';

const store = createStore(reducer, applyMiddleware(thunk));

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <NavigatorIOS
          initialRoute={{
            component: Lists,
            title: 'Mes listes',
          }}
          style={{flex: 1,}}
          transluscent={false}
          itemWrapperStyle={styles.global}
          tintColor={"#7CBCC1"}
        />
      </Provider>
    );
  }
}

const styles = {
  global: {
    backgroundColor: '#E9E5D7'
  }
}
