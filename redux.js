const initialState = {
  lists: [{
    name: 'Choses à faire',
    items: [
      {
        name: 'Changer la litière',
        checked: false
      },
      {
        name: 'Passer l’aspirateur',
        checked: true
      }
    ],
  }, {
    name: 'Courses',
    items: [
      {
        name: 'Dentifrice',
        checked: false
      },
      {
        name: 'Mayonnaise',
        checked: false
      }
    ],
  }],
};

export default (state = initialState, { type, ...action}) => {
  switch (type) {
    case 'SET_CURRENT_LIST':
      return {
        ...state,
        currentList: action.listIndex,
      };

    case 'CHECK':
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
  }
  return state;
}

export const checkItem = (list, item) => {
  return { type: 'CHECK', list, item };
};

export const setCurrentList = listIndex => ({
  type: 'SET_CURRENT_LIST',
  listIndex,
});
