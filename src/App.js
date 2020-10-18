import React, { useState } from 'react';
import axios from 'axios'
import './App.css';

export const fetchData = async (width, height) => {
  try {
    const api = `https://hubbado-maze-api.herokuapp.com/generate?width=${width}&height=${height}`;
    const fetchData = await axios.get(api)
    return fetchData.data.cells;
  }catch(error) {
    return error;
  }
}

export const calculateBody = (cell) => {
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

export const convertArrayToWall = (cell) => {
  const cellBody = {
    8: 'Left',
    4: 'Bottom',
    2: 'Right',
    1: 'Top',
  };
  const cel = cell.map((value) => cellBody[value]);
  return cel;
};


export const formatCellGrid = (cells) => {
  return cells.map((value) => {
    return value.map((c) => {
      return convertArrayToWall(calculateBody(c));
    });
  });
}


const App = () => {
  const [inputValue, setInput] = useState({
    width: '',
    height: '',
  })
  const [apiData, setApiData] = useState([])
  const [status, setButton] = useState(false)

  const handleInput = (e) => {
    e.preventDefault();
    setButton(false);
    const  { name, value } = e.target;
    setInput({ ...inputValue, [name]: value });
  };

  const handleClick = async (e) => {
    const { width, height } = inputValue;
    e.preventDefault();
    setButton(true);
    const fetch = await fetchData(width, height);
    const data = formatCellGrid(fetch);
    setApiData(data);
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.style.gridTemplateColumns = `repeat(${inputValue.width}, 1fr)`;
  }

  const renderMaze = () => {
     return apiData.map((cell) => {
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
          value={inputValue.height}
        />
        <label>Rows</label>
        <input 
          type='number'
          name="width"
          onChange={handleInput}
          min="1"
          required
          value={inputValue.width}
        />
      <button
      onClick={handleClick}
      disabled={status}
      >Go!</button>
        </form>
    <div className="grid-container">
      {renderMaze()}
    </div>
    </div>
  );
}


export default App;
