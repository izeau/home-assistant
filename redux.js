const initialState = {
  lists: [{
    name: 'Choses à faire',
    items: ['Changer la litière', 'Passer l’aspirateur'],
  }, {
    name: 'Courses',
    items: ['Dentifrice', 'Mayonnaise'],
  }],
};

export default (state = initialState, { type, ...action}) => {
  return state;
}
