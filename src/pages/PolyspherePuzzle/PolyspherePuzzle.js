import "./PolyspherePuzzle.css";
import PolyBoard from "../../components/PolyBoard/PolyBoard";
import PieceSelector from "../../components/Shared/PieceSelector/PieceSelector";
import ProgressBar from "../../components/Shared/ProgressBar/ProgressBar";
import KeyboardControls from "../../components/Shared/KeyboardControls/KeyboardControls";
import usePolyspherePuzzle from "../../hooks/usePolyspherePuzzle";

/**
 * A component displaying the polysphere puzzle solver, including the board,
 * shape selector, and input controls.
 *
 * @returns {React.JSX.Element}
 */
function PolyspherePuzzle() {
  const {
    board,
    shapes,
    selectedShape,
    highlightedCells,
    moveStack,
    isSolved,
    isSolving,
    solutions,
    solutionIndex,
    handleSolve,
    handleClear,
    handleNextSolution,
    handlePreviousSolution,
    handleUndo,
    handleMouseEnterCell,
    handleMouseLeaveCell,
    handleMouseClickCell,
    handlePreviousShape,
    handleNextShape,
    handleRotateShape,
    handleFlipShape,
  } = usePolyspherePuzzle();

  return (
    <div className="puzzleTwo">
      <h2>The Polysphere Puzzle</h2>
      <p>
        The <b> polysphere puzzle </b> involves placing <b> 12 </b> unique
        shapes made of connected spheres onto a <b> 5x11 </b> board. Your goal
        is to fit all pieces perfectly into the grid. Each shape is made from a
        different configuration of spheres, and you can use the <b> Solve </b>
        button to find the best way to complete the board.
      </p>
      <ProgressBar current={12 - shapes.length} total={12} />
      {shapes.length > 0 && (
        <PieceSelector
          selectedShape={selectedShape}
          handleFlipShape={handleFlipShape}
          handlePreviousShape={handlePreviousShape}
          handleNextShape={handleNextShape}
          handleRotateShape={handleRotateShape}
        />
      )}
      <PolyBoard
        board={board}
        highlightedCells={highlightedCells}
        handleMouseEnterCell={handleMouseEnterCell}
        handleMouseLeaveCell={handleMouseLeaveCell}
        handleMouseClickCell={handleMouseClickCell}
      />
      <div className="controlsContainer">
        <button onClick={handleSolve} disabled={isSolving}>
          {isSolving ? "Solving..." : "Solve Puzzle"}
        </button>
        <button onClick={handleClear} disabled={isSolving}>
          Clear Board
        </button>
        <button
          onClick={handleUndo}
          disabled={moveStack.length === 0 || isSolving}
        >
          Undo
        </button>
      </div>
      <div>
        {isSolving && <span>Solving ⏳</span>}
        {isSolved && solutions.length > 0 && <span>Solutions found ✅</span>}
        {isSolved && solutions.length === 0 && <span>No solutions ⚠️</span>}
        {solutions.length >= 1 && (
          <div className="solutionNavigation">
            <button
              onClick={handlePreviousSolution}
              disabled={solutionIndex === 0}
            >
              Previous Solution
            </button>
            <span>
              Solution {solutionIndex + 1} of {solutions.length}
            </span>
            <button
              onClick={handleNextSolution}
              disabled={solutionIndex === solutions.length - 1}
            >
              Next Solution
            </button>
          </div>
        )}
      </div>
      <KeyboardControls
        keyMap={[
          {
            key: "r",
            keyAlias: "R",
            description: "Rotate piece",
            onClick: handleRotateShape,
          },
          {
            key: "f",
            keyAlias: "F",
            description: "Flip piece",
            onClick: handleFlipShape,
          },
          {
            key: "ArrowLeft",
            keyAlias: "←",
            description: "Previous piece",
            onClick: handlePreviousShape,
          },
          {
            key: "ArrowRight",
            keyAlias: "→",
            description: "Next piece",
            onClick: handleNextShape,
          },
          {
            key: "Escape",
            keyAlias: "Esc",
            description: "Clear board",
            onClick: handleClear,
          },
          {
            key: "u",
            keyAlias: "U",
            description: "Undo action",
            onClick: handleUndo,
          },
          {
            key: "s",
            keyAlias: "S",
            description: "Solve puzzle",
            onClick: handleSolve,
          },
        ]}
      />
    </div>
  );
}

export default PolyspherePuzzle;
