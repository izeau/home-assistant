import React from 'react';
import { StyleSheet, Text, ListView } from 'react-native';

export default class List extends React.Component {

  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      listItems: ds.cloneWithRows(['machin', 'truc'])
    };
  }

  render() {
    return (
      <ListView style={styles.list}
        dataSource={this.state.listItems}
        renderRow={this.renderRow}
      />
    );
  }

  renderRow(rowData) {
    return <Text style={styles.listItems}>{rowData}</Text>;
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listItems: {
    flex: 1,
    justifyContent: 'flex-start'
  }
});
