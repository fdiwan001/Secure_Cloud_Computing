/* eslint-disable no-unused-expressions */
/* eslint-disable quotes */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import NavbarComponent from './navbar';

configure({ adapter: new Adapter() });

describe('NavbarComponent', () => {
  ``;
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<NavbarComponent debug />);
    console.log('wiritng a test');
    expect(component).toMatchSnapshot();
  });
});
