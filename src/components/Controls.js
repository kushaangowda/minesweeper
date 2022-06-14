import React from "react";

function Controls({ setMode, numFlags }) {
  const hardMode = () => {
    setMode(3);
  };

  const mediumMode = () => {
    setMode(2);
  };

  const easyMode = () => {
    setMode(1);
  };

  return (
    <div className="controls">
      <div className="button" onClick={easyMode}>
        Easy
      </div>
      <div className="button" onClick={mediumMode}>
        Medium
      </div>
      <div className="button" onClick={hardMode}>
        Hard
      </div>
      <div className="button">{numFlags}</div>
    </div>
  );
}

export default Controls;
