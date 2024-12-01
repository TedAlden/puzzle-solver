import "./PolyspherePuzzle.css";
import PolysphereBoard from "../../components/PolysphereBoard/PolysphereBoard";
import PieceSelector from "../../components/PieceSelector/PieceSelector";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import KeyboardControls from "../../components/KeyboardControls/KeyboardControls";
import usePolyspherePuzzle from "../../hooks/usePolyspherePuzzle";
import SolutionNavigator from "../../components/SolutionNavigator/SolutionNavigator";

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
    handleSetSolutionIndex,
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
      <PolysphereBoard
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
          <SolutionNavigator
            solutionIndex={solutionIndex}
            solutionsLength={solutions.length}
            handleSetSolutionIndex={handleSetSolutionIndex}
          />
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
