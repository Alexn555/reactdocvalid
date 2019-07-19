import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';

import App from './App';

it('should render correctly with no props', () => {
  const component = shallow(<App/>);
  
  expect(component).toMatchSnapshot();
});