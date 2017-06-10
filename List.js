import React from 'react';
import { StyleSheet, Text, View, ListView } from 'react-native';

export default class List extends React.Component {

  constructor(props) {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      listItems: ds.cloneWithRows(props.items)
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
    return (
      <View style={styles.listItem}>
        <Text>{rowData}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listItem: {
    flex: 1,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: '#DDD',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    marginTop: -1,
    padding: 10,
  },
});
