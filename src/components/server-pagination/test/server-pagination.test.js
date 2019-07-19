import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ServerPagination from '../server-pagination';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('ServerPagination component', () => {

 let props;
 let wrapper;
 let store = mockStore({ documentsStore: {
        documents: [],
        loading: false,
        error: {}
    }});

  beforeEach(() => {
    props = {
      documentsStore: {
        documents: [],
        loading: false,
        error: {}
      }
    };
	wrapper = mount(
		  <Provider store={store}>
			<ServerPagination />
		  </Provider>
	 );
  });
  
  it('should render correctly', () => {
     expect(wrapper.instance()).toMatchSnapshot();
  });
  
  it("should wrapper instance to be defined", () => {
	  expect(wrapper.instance().props).toBeDefined();
  });
  
  it("renders a pagination class", () => {  
	expect(wrapper.find('.page-navigation')).toBeDefined();
  });
  
   it("renders a pagination previous, next buttons", () => {  
	expect(wrapper.find('.server-nav-item')).toBeDefined();
  });
 

});