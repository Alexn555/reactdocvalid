import { client } from '../services/';

export function fetchDocuments(page = 1, perPage = 10){
  return dispatch => {
    dispatch({
      type: 'FETCH_DOCUMENTS',
      payload: client.get('documents?page='+page+'&perPage='+perPage)
    })
  }
}
