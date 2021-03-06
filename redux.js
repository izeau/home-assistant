const initialState = {
  modal: false,
  lists: [],
};

const actions = {
  SET_LISTS(state, action) {
    return {
      ...state,
      lists: action.lists
    };
  },

  MODAL_VISIBILITY(state, action) {
    return {
      ...state,
      modal: action.visible
    };
  },

  CREATE_ITEM(state, action) {
    const oldList = state.lists[state.currentList];
    const newList = {
      ...oldList,
      items: [
        { name: action.name, checked: false },
        ...oldList.items,
      ],
    };

    return {
      ...state,
      lists: [
        ...state.lists.slice(0, state.currentList),
        newList,
        ...state.lists.slice(state.currentList + 1)
      ]
    };
  },

  SET_CURRENT_LIST(state, action) {
    return {
      ...state,
      currentList: action.listIndex,
    };
  },

  CHECK(state, action) {
    const oldList = state.lists[state.currentList];
    const newList = {
      ...oldList,
      items: oldList.items.map(item =>
        item !== action.item
          ? item
          : { ...item, checked: !item.checked }
      ),
    };

    return {
      ...state,
      lists: [
        ...state.lists.slice(0, state.currentList),
        newList,
        ...state.lists.slice(state.currentList + 1)
      ]
    };
  },
};

export default (state = initialState, { type, ...action}) => {
  if (actions[type]) {
    return actions[type](state, action);
  }

  return state;
}

export const getLists = () => dispatch => {
  fetch(new Request('/api/lists'))
    .then(response => response.json())
    .then(list => dispatch({ type: 'SET_LISTS', lists: lists }));
};

export const checkItem = (list, item) => {
  return { type: 'CHECK', list, item };
};

export const setCurrentList = listIndex => ({
  type: 'SET_CURRENT_LIST',
  listIndex,
});

export const createItem = newItemName => dispatch => {
  dispatch({ type: 'CREATE_ITEM', name: newItemName });
  dispatch({ type: 'MODAL_VISIBILITY', visible: false });
};

export const showModal = () => {
  return { type: 'MODAL_VISIBILITY', visible: true };
};
