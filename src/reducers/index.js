import { combineReducers } from 'redux';
import DocumentsReducer from './documents-reducer';

const reducers = {
  documentsStore: DocumentsReducer,
}

const rootReducer = combineReducers(reducers);

export default rootReducer;
