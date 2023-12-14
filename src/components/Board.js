import React, { useEffect, useState } from "react";
import Cell from "./Cell";

let evaluated;
let totalBombs = 0;

function Board({ mode, numCellsPerRow, numCellsPerColumn, setNumFlags, numFlags }) {
  const newArray = (arr) => JSON.parse(JSON.stringify(arr));

  const [r, setR] = useState(false);
  const refreshPage = () => {
    setR(!r);
  };

  // reset cell board
  useEffect(() => {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    const numNeighborBombs = (newCellValue, i, j) => {
      let cellCount = 0;

      cellCount += i - 1 >= 0 && j - 1 >= 0 ? newCellValue[i - 1][j - 1] : 0;
      cellCount += i + 1 < numCellsPerColumn && j - 1 >= 0 ? newCellValue[i + 1][j - 1] : 0;
      cellCount += i - 1 >= 0 && j + 1 < numCellsPerRow ? newCellValue[i - 1][j + 1] : 0;
      cellCount +=
        i + 1 < numCellsPerColumn && j + 1 < numCellsPerRow ? newCellValue[i + 1][j + 1] : 0;
      cellCount += i - 1 >= 0 ? newCellValue[i - 1][j] : 0;
      cellCount += i + 1 < numCellsPerColumn ? newCellValue[i + 1][j] : 0;
      cellCount += j - 1 >= 0 ? newCellValue[i][j - 1] : 0;
      cellCount += j + 1 < numCellsPerRow ? newCellValue[i][j + 1] : 0;

      return -cellCount;
    };

    let newNumBombs = 0;
    const prob = mode === 3 ? 0.22 : mode === 2 ? 0.16 : 0.1;
    const newCellValue = new Array(numCellsPerColumn).fill(0).map((_) => {
      return new Array(numCellsPerRow).fill(0).map((_) => {
        const isBomb = Math.random() <= prob ? -1 : 0;
        newNumBombs -= isBomb;
        return isBomb;
      });
    });

    totalBombs = newNumBombs;
    setNumFlags(newNumBombs);

    let distance = 1000;

    const newCellValue2 = newArray(newCellValue).map((row, i) =>
      row.map((val, j) => {
        if (val === -1) return val;
        const numNeighbors = numNeighborBombs(newCellValue, i, j);
        if (numNeighbors === 0) {
          const currDist = Math.max(i, numCellsPerColumn - i, j, numCellsPerRow - j);
          if (currDist < distance) {
            setStartCell([i, j]);
            distance = currDist;
          }
        }
        return numNeighbors;
      })
    );
    setCellValue(newCellValue2);

    const newCellStatus = new Array(numCellsPerColumn)
      .fill(0)
      .map((_) => new Array(numCellsPerRow).fill(0));
    setCellStatus(newCellStatus);

    evaluated = new Array(numCellsPerColumn)
      .fill(0)
      .map((_) => new Array(numCellsPerRow).fill(false));
  }, [numCellsPerRow, numCellsPerColumn, mode, r, setNumFlags]);

  const [cellValue, setCellValue] = useState([]);
  const [cellStatus, setCellStatus] = useState([]);
  const [startCell, setStartCell] = useState([0, 0]);

  const moveAhead = (i, j) => {
    let indices = [];
    if (!evaluated[i][j] && !cellStatus[i][j]) {
      indices.push([i, j]);
      evaluated[i][j] = true;
      if (cellValue[i][j] === 0) indices = indices.concat(nextEmptyCells(i, j));
    }
    return indices;
  };

  const nextEmptyCells = (i, j) => {
    let indices = [];

    if (i - 1 >= 0) {
      indices = indices.concat(moveAhead(i - 1, j));
      if (j - 1 >= 0) indices = indices.concat(moveAhead(i - 1, j - 1));
      if (j + 1 < numCellsPerRow) indices = indices.concat(moveAhead(i - 1, j + 1));
    }

    if (i + 1 < numCellsPerColumn) {
      indices = indices.concat(moveAhead(i + 1, j));
      if (j - 1 >= 0) indices = indices.concat(moveAhead(i + 1, j - 1));
      if (j + 1 < numCellsPerRow) indices = indices.concat(moveAhead(i + 1, j + 1));
    }

    if (j - 1 >= 0) indices = indices.concat(moveAhead(i, j - 1));

    if (j + 1 < numCellsPerRow) indices = indices.concat(moveAhead(i, j + 1));

    return indices;
  };

  const openUpCells = (indices) => {
    let newCellStatus = newArray(cellStatus);
    for (let i = 0; i < indices.length; i++) {
      newCellStatus[indices[i][0]][indices[i][1]] = 1;
    }
    setCellStatus(newCellStatus);

    let currNumPending = 0;
    newCellStatus.map((cellRow) =>
      cellRow.map((cellStat) => {
        if (cellStat === 1) {
          currNumPending += 1;
        }
        return 0;
      })
    );

    if (
      currNumPending === numCellsPerColumn * numCellsPerRow - totalBombs &&
      newCellStatus.length > 0
    ) {
      setTimeout(() => {
        window.alert("You Won");
        refreshPage();
      }, 200);
    }
  };

  const handleClick = (i, j) => {
    if (
      (startCell[0] === -1 || (startCell[0] === i && startCell[1] === j)) &&
      cellStatus[i][j] === 0
    ) {
      const value = cellValue[i][j];
      let indices = [[i, j]];
      if (value === 0) {
        indices = indices.concat(nextEmptyCells(i, j));
      } else if (value === -1) {
        setTimeout(() => {
          window.alert("You Lost");
          refreshPage();
        }, 200);
      }

      openUpCells(indices);
      setStartCell([-1, -1]);
    }
  };

  const handleRightClick = (i, j) => {
    if (cellStatus[i][j] === 0) {
      let newCellStatus = newArray(cellStatus);
      newCellStatus[i][j] = -1;
      setCellStatus(newCellStatus);
      setNumFlags(numFlags - 1);
    } else if (cellStatus[i][j] === -1) {
      let newCellStatus = newArray(cellStatus);
      newCellStatus[i][j] = 0;
      setCellStatus(newCellStatus);
      setNumFlags(numFlags + 1);
    }
  };

  return (
    <div className="cellBoard">
      {cellStatus.map((cellRow, i) => {
        return (
          <div className="cellRow" key={i}>
            {cellRow.map((cellStat, j) => (
              <Cell
                key={i * numCellsPerRow + j}
                status={cellStat}
                value={cellValue[i][j]}
                handleClick={() => {
                  handleClick(i, j);
                }}
                handleRightClick={() => {
                  handleRightClick(i, j);
                }}
                startCell={startCell[0] === i && startCell[1] === j}
                startCellVal={startCell}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default Board;
