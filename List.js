import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TouchableHighlight,
  ListView,
  View,
  Modal,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { checkItem, createItem } from './redux';

class List extends React.Component {
  constructor(props) {
    super();
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      ds,
      listItems: props.list ? ds.cloneWithRows(props.list.items) : ds.cloneWithRows([])
    };
  }

  componentWillReceiveProps({ list: { items }}) {
    this.setState({
      listItems: this.state.ds.cloneWithRows(items),
      newItemName: ''
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ListView style={styles.list}
          dataSource={this.state.listItems}
          renderRow={(item) => this._renderRow(item)}
        />
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.props.modal}
          >
         <View style={{marginTop: 22}}>
          <View>
            <TextInput
              style={{height: 40}}
              placeholder="Type here to translate!"
              onChangeText={(newItemName) => this.setState({newItemName})}
            />
            <Button
              onPress={() => this.props.dispatch(createItem(this.state.newItemName))}
              title="Ajouter"
              color="#841584"
            />
          </View>
         </View>
        </Modal>
      </View>
    );
  }

  _renderRow(item) {
    return (
      <TouchableHighlight underlayColor="#CCC" onPress={() => this._toggleCheck(item)}>
        <View style={styles.listItem}>
          {item.checked
            ? <Icon name="md-checkmark-circle-outline" size={18} style={{ width: 20 }} color="#090" />
            : <View style={{ width: 20 }} /> }
          <Text>{item.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  _toggleCheck(item) {
    this.props.dispatch(checkItem(this.props.list, item));
  }
}

const mapStateToProps = ({ lists, currentList, modal }) => ({
  list: lists[currentList],
  modal
});

export default connect(mapStateToProps)(List);

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#DDD',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    marginTop: -1,
    padding: 10,
    height: 40,
  },
});
