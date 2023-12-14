import React from "react";
import { FaBomb } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import { IoGolf } from "react-icons/io5";

function Cell({ status, value, handleClick, startCell, handleRightClick, startCellVal }) {
  const colors = ["black", "green", "red", "brown", "orange", "blue", "purple", "maroon"];

  return (
    <div
      className={"cell" + ((startCellVal[0] === -1 && status !== 1) || startCell ? " closed" : "")}
      style={{
        backgroundColor: status === 1 ? "#e3e5e9" : "green",
        color: value !== -1 ? colors[value] : "black",
      }}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    >
      {status === -1 && <IoGolf style={{ color: "red" }} />}
      {startCell && <AiFillStar style={{ color: "gold" }} />}
      {!startCell && status === 1 && value !== 0 && (value === -1 ? <FaBomb /> : value)}
    </div>
  );
}

export default Cell;
