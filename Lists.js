import React from 'react';
import { StyleSheet, Text, ListView, TouchableHighlight } from 'react-native';
import List from './List';

export default class Lists extends React.Component {

  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      lists: ds.cloneWithRows(['Choses à faire', 'Courses'])
    };
  }

  _onForward(listName) {
    this.props.navigator.push({
      component: List,
      title: listName,
    });
  }

  render() {
    return (
      <ListView style={styles.lists}
        dataSource={this.state.lists}
        renderRow={rowData => this.renderRow(rowData)}
      />
    );
  }

  renderRow(rowData) {
    return (
      <TouchableHighlight underlayColor={'#CCC'} onPress={() => this._onForward(rowData)}>
        <Text style={styles.list}>{rowData}</Text>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  lists: {
    flex: 1,
  },
  list: {
    flex: 1,
    justifyContent: 'flex-start'
  }
});
