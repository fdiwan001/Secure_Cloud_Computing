import React from 'react';
import { shallow } from 'enzyme';
import NavbarComponent from './navbar';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';

configure({adapter: new Adapter()});

describe('NavbarComponent', () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<NavbarComponent debug />);
  
    expect(component).toMatchSnapshot();
  });
});