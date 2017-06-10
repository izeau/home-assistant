import React from 'react';
import { StyleSheet, Text, ListView, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import List from './List';

class Lists extends React.Component {
  constructor(props) {
    super();
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      lists: ds.cloneWithRows(props.lists),
    };
  }

  _onForward(list) {
    this.props.navigator.push({
      component: List,
      title: list.name,
      passProps: { items: list.items },
    });
  }

  render() {
    return (
      <ListView style={styles.lists}
        dataSource={this.state.lists}
        renderRow={list => this.renderRow(list)}
      />
    );
  }

  renderRow(list) {
    return (
      <TouchableHighlight
        style={styles.list}
        underlayColor={'#CCC'}
        onPress={() => this._onForward(list)}
      >
        <Text>{list.name}</Text>
      </TouchableHighlight>
    );
  }
}

const mapStateToProps = ({ lists }) => ({ lists });

export default connect(mapStateToProps)(Lists);

const styles = StyleSheet.create({
  lists: {
    flex: 1,
  },
  list: {
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
