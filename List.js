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

        <View style={styles.addBar}>
          <TextInput
            style={styles.addInput}
            placeholder="Tâche ..."
            onChangeText={(newItemName) => this.setState({newItemName})}
            value={this.state.newItemName}
          />
          <Icon.Button
            name="md-add"
            borderRadius={0}
            backgroundColor="#7CBCC1"
            iconStyle={styles.addIconItenList}
            onPress={() => {
              this.props.dispatch(createItem(this.state.newItemName));
              this.setState({ newItemName: '' });
            }}/>
        </View>

        <ListView style={styles.list}
          dataSource={this.state.listItems}
          automaticallyAdjustContentInsets={false}
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
              placeholder="Tâche ..."
              onChangeText={(newItemName) => this.setState({newItemName})}
            />
          </View>
         </View>
        </Modal>
      </View>
    );
  }

  _renderRow(item) {
    return (
      <TouchableHighlight underlayColor={'#f7f5ef'} onPress={() => this._toggleCheck(item)}>
        <View style={styles.listItem}>
          {item.checked
            ? <Icon name="md-checkmark-circle-outline" size={18} style={{ width: 30, padding: 10 }} color="#090" />
            : <View style={{ width: 30 }} /> }
          <Text style={{flex: 1, padding: 20, color: '#0C161B', fontSize: 16 }}>{item.name}</Text>
          <Icon.Button
            name="ios-more-outline"
            borderRadius={0}
            backgroundColor="#CCCDC4"
            iconStyle={styles.iconItemList}
            onPress={() => console.warn("edit")}/>
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
  addBar: {
    marginTop: 65,
    flexDirection: 'row',
    height: 60
  },
  addInput: {
    flex:2,
    paddingLeft: 60,
    paddingRight: 20,
    backgroundColor: '#f7f5ef',
    height: 60
  },
  list: {
    flex: 1,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#BCBDB4',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    marginTop: -1,
  },
  addIconItenList: {
    height: 60,
    marginRight: 0,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20
  },
  iconItemList: {
    marginRight: 0,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    color: '#0C161B',
  }
});
