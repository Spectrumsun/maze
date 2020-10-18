import React from 'react';
import {shallow } from 'enzyme';
import axios from 'axios'
import App, { 
    fetchData, 
    calculateBody, 
    convertArrayToWall, 
    formatCellGrid
} from '../App';

const wrapper = shallow(<App />);
jest.mock('axios');
const data = {
  data: {
    cells: [
        [11, 11, 9, 7, 11],
        [10, 8, 4, 7, 10],
        [12, 2, 13, 3, 10],
        [13, 4, 1, 2, 10],
        [13, 5, 6, 12, 6],
    ]
  }
};

describe('Function test <Unit test>', () => {
  it('should test calculateBody function', () => {
    const cB = calculateBody(10)
     expect(cB).toEqual([8, 2]);
   });
 
   it('should test calculateBody function', () => {
     const cB = calculateBody(1)
      expect(cB).toEqual([1]);
    });
 
    it('should test convertArrayToWall function', () => {
     const cAt = convertArrayToWall([8,2,1]);
      expect(cAt).toEqual(['Left', 'Right', 'Top']);
    });
 
    it('should test convertArrayToWall function', () => {
     const cAt = convertArrayToWall([2,1]);
      expect(cAt).toEqual(['Right', 'Top']);
    });
 
    it('should test formatCellGrid function', () => {
     const cAt = formatCellGrid([[1,2,3], [2,4,8]]);
      expect(cAt).toEqual([
       [ [ 'Top' ], [ 'Right' ], [ 'Right', 'Top' ] ],
       [ [ 'Right' ], [ 'Bottom' ], [ 'Left' ] ]
     ] );
    });
 
    it('should test fetchData function', async () => {
     axios.get.mockImplementationOnce(() => Promise.resolve(data));
     await expect(fetchData(5, 5)).resolves.toEqual(data.data.cells);
     expect(axios.get).toHaveBeenCalledWith(
      `https://hubbado-maze-api.herokuapp.com/generate?width=${5}&height=${5}`
    );
    });
});

describe('<LApp />', () => {
  it('should match the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should have an input field', () => {
    expect(wrapper.find('input[name="height"]').length).toEqual(1);
  });

  it('should have an input field', () => {
    expect(wrapper.find('input[name="width"]').length).toEqual(1);
  });

  it('should have an submit button', () => {
    expect(wrapper.find('button').length).toEqual(1);
  });

  it('should set the input value on change event with', () => {
    wrapper.find('input[name="height"]').simulate('change', {
      preventDefault: jest.fn(),
      target: { name: 'height', value: 5 }
    });
    expect(wrapper.find('input[name="height"]').prop('value')).toEqual(
      5,
    );
  });


  it('should set the input value on change event with', () => {
    wrapper.find('input[name="height"]').simulate('change', {
      preventDefault: jest.fn(),
      target: { name: 'width', value: 6 }
    });
    expect(wrapper.find('input[name="width"]').prop('value')).toEqual(
      6,
    );
  });


  it('should click the submit button', async () => {
    jest.spyOn(document, 'querySelector').mockReturnValueOnce({ 
      style: {
        gridTemplateColumns : 1, 
    }
    });
    axios.get.mockImplementationOnce(() => data);
    wrapper.find('button').simulate('click', {
      preventDefault: jest.fn(),
    });

    axios.get.mockImplementationOnce(() => data);
    expect(wrapper.find('button').prop('disabled')).toEqual(true);
  });


  it('should click render maze',  () => {
    jest.spyOn(document, 'querySelector').mockReturnValueOnce({ 
      style: {
        gridTemplateColumns : 1, 
    }
    });
    axios.get.mockImplementationOnce(() => data);
    wrapper.find('button').simulate('click', {
      preventDefault: jest.fn(),
    });
    axios.get.mockImplementationOnce(() => data);
    wrapper.update()
    expect(wrapper.find('.maze-box').length).toEqual(25);
  });
});
