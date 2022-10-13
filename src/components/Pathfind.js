import React, { useState, useEffect } from "react";
import Node from "./Node";
import Astar from "../Astar/astar";
import "./Pathfind.css";

const cols = 25;
const rows = 10;

const NODE_STRAT_ROWS = 0;
const NODE_STRAT_COLS = 0;
const NODE_END_ROWS = rows - 1;
const NODE_END_COLS = cols - 1;

const Pathfind = () => {
  const [Grid, setGrid] = useState([]);
  const [Path, setPath] = useState([]);
  const [VisitedNodes, setVisitedNodes] = useState([]);

  useEffect(() => {
    initalizeGrid();
  },[]);

  //CREATES THE GRID
  const initalizeGrid = () => {
    const grid = new Array(rows);

    for (let i = 0; i < rows; i++) {
      grid[i] = new Array(cols);
    }

    createSpot(grid);

    setGrid(grid);

    addNieghbours(grid);

    const startNode = grid[NODE_STRAT_ROWS][NODE_STRAT_COLS];
    const endNode = grid[NODE_END_ROWS][NODE_END_COLS];
    let x = Astar(startNode, endNode); 
    startNode.isWall = false;
    endNode.isWall = false;
    setPath(x.path);
    setVisitedNodes(x.visitedNodes);
    
  };

  //CREATE SPOT
  const createSpot = (grid) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j] = new Spot(i, j);
      }
    }
  };

  //Add Neighbours
  const addNieghbours = (grid) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j].addneighbours(grid);
      }
    }
  };

  //SPOT CONSTRUCTOR
  function Spot(i, j) {
    this.x = i;
    this.y = j;
    this.isStart = this.x === NODE_STRAT_ROWS && this.y === NODE_STRAT_COLS;
    this.isEnd = this.x === NODE_END_ROWS && this.y === NODE_END_COLS;
    this.g = 0;
    this.f = 0;
    this.h = 0;
    this.neighbours = [];
    this.isWall = false;
    if(Math.random(1)<0.2)
    {
      this.isWall = true;
    }
    this.previous = undefined;
    this.addneighbours = function (grid) {
      let i = this.x;
      let j = this.y;
      if (i > 0) this.neighbours.push(grid[i - 1][j]);
      if (i < rows - 1) this.neighbours.push(grid[i + 1][j]);
      if (j > 0) this.neighbours.push(grid[i][j - 1]);
      if (j < cols - 1) this.neighbours.push(grid[i][j + 1]);
    };
  }

  //GRID WITH NODE    
  const gridwithNode = (
    <div>
      {Grid.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className="rowWrapper">
            {row.map((col, colIndex) => {
              const { isStart, isEnd ,isWall} = col;
              return (
                <Node
                  key={colIndex}
                  isStart={isStart}
                  isEnd={isEnd}
                  row={rowIndex}
                  col={colIndex}
                  isWall = {isWall}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );

  const visualizeShortestPath = (shortestPathNodes) => {

    for (let i = 0; i < shortestPathNodes.length-2; i++) {
      setTimeout(() => {
        const node = shortestPathNodes[i+1];
        document.getElementById(`node-${node.x}-${node.y}`).className =
          "node node-shortest-path";
      }, 10 * i);
    }
  };

  const visualizePath = () => {
    for (let i = 0; i <= VisitedNodes.length; i++) {
      if (i+1 === VisitedNodes.length) {
        console.log(Path)
        setTimeout(() => {
          visualizeShortestPath(Path);
        }, 20 * i);
      } else if(VisitedNodes[i+1] !== Grid[NODE_END_ROWS][NODE_END_COLS]){
        setTimeout(() => {
          const node = VisitedNodes[i+1];
          document.getElementById(`node-${node.x}-${node.y}`).className =
            "node node-visited";
        }, 10 * i);
      }
    }
  };

  return (
    <div className="Wrapper">
      <button onClick={visualizePath}>Visualize Path</button>
      <h1>Pathfind Visualizer</h1>
      {gridwithNode}
    </div>
  );
};

export default Pathfind;
