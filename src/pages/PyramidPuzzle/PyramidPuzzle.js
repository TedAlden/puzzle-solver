import "./PyramidPuzzle.css";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import PyramidBoard from "../../components/PyramidBoard/PyramidBoard";
import PyramidLayerBoards from "../../components/PyramidLayerBoards/PyramidLayerBoards";
import KeyboardControls from "../../components/KeyboardControls/KeyboardControls";
import usePyramidPuzzle from "../../hooks/usePyramidPuzzle";
import PyramidPieceSelector from "../../components/PyramidPieceSelector/PyramidPieceSelector";
import SolutionNavigator from "../../components/SolutionNavigator/SolutionNavigator";
import BoardSave from "../../components/BoardSave/BoardSave";

// TODO: add x,y,z guide lines

function PyramidPuzzle() {
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
    handleRotatePieceX,
    handleRotatePieceY,
    handleRotatePieceZ,
    handleFlipPieceX,
    handleFlipPieceY,
    handleFlipPieceZ,
    handleSolve,
    handleClear,
    handleSetSolutionIndex,
    handleUndo,
    handleMouseEnterCell,
    handleMouseLeaveCell,
    handleMouseClickCell,
    handlePreviousPiece,
    handleNextPiece,
  } = usePyramidPuzzle();

  const keyMap = [
    {
      key: "r",
      keyAlias: "R",
      description: "Rotate piece X",
      onClick: handleRotatePieceX,
    },
    {
      key: "t",
      keyAlias: "T",
      description: "Rotate piece Y",
      onClick: handleRotatePieceY,
    },
    {
      key: "y",
      keyAlias: "Y",
      description: "Rotate piece Z",
      onClick: handleRotatePieceZ,
    },
    {
      key: "f",
      keyAlias: "F",
      description: "Flip piece X",
      onClick: handleFlipPieceX,
    },
    {
      key: "g",
      keyAlias: "G",
      description: "Flip piece Y",
      onClick: handleFlipPieceY,
    },
    {
      key: "h",
      keyAlias: "H",
      description: "Flip piece Z",
      onClick: handleFlipPieceZ,
    },
    {
      key: "ArrowLeft",
      keyAlias: "←",
      description: "Previous piece",
      onClick: handlePreviousPiece,
    },
    {
      key: "ArrowRight",
      keyAlias: "→",
      description: "Next piece",
      onClick: handleNextPiece,
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
  ];

  return (
    <div className="puzzleThree">
      <h2>The Pyramid Puzzle</h2>
      <div className="wrapper">
        <div className="column leftColumn">
          <p className="description">
            The <b> pyramid puzzle </b> involves placing <b> 12 </b> unique
            shapes made of connected spheres onto a <b> pyramid </b> board. Your
            goal is to fit all pieces perfectly into the grid. Each shape is
            made from a different configuration of spheres, and you can use the
            <b> Solve </b> button to find the best way to complete the board.
          </p>
          <ProgressBar
            current={12 - shapes.length}
            total={12}
            variant="pyramid"
          />
          <KeyboardControls keyMap={keyMap} />
        </div>
        <div className="column middleColumn">
          <PyramidPieceSelector
            selectedShape={selectedShape}
            onFlipX={handleFlipPieceX}
            onFlipY={handleFlipPieceY}
            onFlipZ={handleFlipPieceZ}
            onRotateX={handleRotatePieceX}
            onRotateY={handleRotatePieceY}
            onRotateZ={handleRotatePieceZ}
            onPrevious={handlePreviousPiece}
            onNext={handleNextPiece}
          />
          <PyramidBoard
            board={board}
            highlightedCells={highlightedCells}
            selectedShape={selectedShape}
          />
          <div className="saveAction">
            <BoardSave board={board} />
          </div>
          <div>
            <div className="controlsContainer">
              <button
                data-testid="solve-button"
                onClick={handleSolve}
                disabled={isSolving}
              >
                {isSolving ? "Solving..." : "Solve Puzzle"}
              </button>
              <button
                data-testid="clear-button"
                onClick={handleClear}
                disabled={isSolving}
              >
                Clear Board
              </button>
              <button
                data-testid="undo-button"
                onClick={handleUndo}
                disabled={moveStack.length === 0 || isSolving}
              >
                Undo
              </button>
            </div>
            <div className="solutionsText">
              {isSolving && <span>Solving ⏳</span>}
              {isSolved && solutions.length > 0 && (
                <span>Solutions found ✅</span>
              )}
              {isSolved && solutions.length === 0 && (
                <span>No solutions ⚠️</span>
              )}
            </div>
            {solutions.length >= 1 && (
              <SolutionNavigator
                solutionIndex={solutionIndex}
                solutionsLength={solutions.length}
                handleSetSolutionIndex={handleSetSolutionIndex}
              />
            )}
          </div>
        </div>
        <div className="column rightColumn">
          <PyramidLayerBoards
            board={board}
            highlightedCells={highlightedCells}
            handleMouseEnterCell={handleMouseEnterCell}
            handleMouseLeaveCell={handleMouseLeaveCell}
            handleMouseClickCell={handleMouseClickCell}
          />
        </div>
      </div>
    </div>
  );
}

export default PyramidPuzzle;
