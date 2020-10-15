import React, { useState } from 'react';
import axios from 'axios'
import './index';

const App = () => {
  const [inputValue, setInput] = useState({
    width: 0,
    height: 0,
  })
  const [apiData, setApiData] =useState([])

  const handleInput = (e) => {
    e.preventDefault();
    const  { name, value } = e.target;
    setInput({ ...inputValue, [name]: value });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const { width, height } = inputValue;
    const api = `https://hubbado-maze-api.herokuapp.com/generate?width=${width}&height=${height}`;
    const fetchData = await axios(api)
    formatCellGrid(fetchData.data.cells)
    const gridContainer =document.querySelector('.grid-container');
    gridContainer.style.gridTemplateColumns = `repeat(${inputValue.width}, 1fr)`;
  }

  const calculateBody = (cell) => {
    const cellWall = [8, 4, 2, 1];
    const removeHighestCellWall = cellWall.filter((value) => value <= cell);
    let total = 0;
    const newCell = [];
    for (let i = 0; i < removeHighestCellWall.length; i++) {
      if (total === cell) {
        break;
      } else if (total < cell) {
        total += removeHighestCellWall[i];
        newCell.push(removeHighestCellWall[i]);
      } else {
        newCell.pop();
        total -= removeHighestCellWall[i];
        newCell.push(removeHighestCellWall[i]);
      }
    }
    return newCell;
  };

  const convertArrayToWall = (cell) => {
    const cellBody = {
      8: 'Left',
      4: 'Bottom',
      2: 'Right',
      1: 'Top',
    };
    const cel = cell.map((value) => cellBody[value]);
    return cel;
  };

  const formatCellGrid = (cells) => {
    const result = cells.map((value) => {
      return value.map((c) => {
        return convertArrayToWall(calculateBody(c));
      });
    });
    setApiData(result);
  }

  return (
      <div className="container">
        <h1>Maze</h1>
        <form className="input">
        <label>Columns</label>
        <input 
          type='number'
          name="height"
          onChange={handleInput}
          min="1"
          required
        />
        <label>Rows</label>
        <input 
          type='number'
          name="width"
          onChange={handleInput}
          min="1"
          required
        />
      <button
      onClick={handleClick}
      >Go!</button>
        </form>
    <div className="grid-container">
      {
        apiData.map((cell) => {
          return cell.map((cel, index) => {
            const borderStyle = cel.reduce((obj, item) => {
              return {
                    ...obj,
                    [`border${item}Color`]: 'black',
                  };
                }, {})
            return (
            <div className="maze-box" key={index} style={borderStyle}></div>
              )
          }
        )
        })
      }
    </div>
    </div>
  );
}


export default App;
