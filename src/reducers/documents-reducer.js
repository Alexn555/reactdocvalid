const defaultState = {
  documents: [],
  loading: false,
  errors:{}
};

export default (state=defaultState, action={}) => {
  switch (action.type) {
    case 'FETCH_DOCUMENTS_FULFILLED': {
      return {
        ...state,
        documents: action.payload.data.data,
        loading: false,
        errors: {}
      }
    }
    case 'FETCH_DOCUMENTS_PENDING': {
      return {
        ...state,
        loading: true,
        errors: {}
      }
    }
    case 'FETCH_DOCUMENTS_REJECTED': {
      return {
        ...state,
        loading: false,
        errors: { global: 'Documents nothing found' }
      }
    }

    default:
      return state;
  }
}
