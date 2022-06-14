import { useEffect, useState } from "react";
import Board from "./components/Board";
import Controls from "./components/Controls";

function App() {
  const [numCellsPerRow, setNumCellsPerRow] = useState(10);
  const [numCellsPerColumn, setNumCellsPerColumn] = useState(10);
  const [numFlags, setNumFlags] = useState(0);

  const updateWindowDimensions = () => {
    const widthParam = Math.floor(0.7 * window.innerWidth);
    const heightParam = Math.floor(0.65 * window.innerHeight);
    setNumCellsPerRow(Math.floor(widthParam / 30));
    setNumCellsPerColumn(Math.floor(heightParam / 30));
  };

  useEffect(() => {
    updateWindowDimensions();
    window.addEventListener("resize", updateWindowDimensions);
    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  const [mode, setMode] = useState(1);

  return (
    <div className="App">
      <h1 className="title">Minesweeper</h1>
      <Controls setMode={setMode} numFlags={numFlags} />
      <Board
        mode={mode}
        numCellsPerRow={numCellsPerRow}
        numCellsPerColumn={numCellsPerColumn}
        setNumFlags={setNumFlags}
        numFlags={numFlags}
      />
    </div>
  );
}

export default App;
