import { useEffect } from "react";
import "./PyramidPuzzle.css";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import PyramidBoard from "../../components/PyramidBoard/PyramidBoard";
import PyramidLayerBoards from "../../components/PyramidLayerBoards/PyramidLayerBoards";
import KeyboardControls from "../../components/KeyboardControls/KeyboardControls";
import usePyramidPuzzle from "../../hooks/usePyramidPuzzle";
import PieceSelector3D from "../../components/PiecePreview/PyramidPiecePreview";

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
    handleNextSolution,
    handlePreviousSolution,
    handleUndo,
    handleMouseEnterCell,
    handleMouseLeaveCell,
    handleMouseClickCell,
    handlePreviousPiece,
    handleNextPiece,
  } = usePyramidPuzzle();

  useEffect(() => {
    console.log(`Number of solutions: ${solutions.length}`);
  }, [solutions]);

  return (
    <div
      className="puzzleThree"
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div
        className="leftColumn"
        style={{
          flex: 2,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "50%",
        }}
      >
        <div className="puzzle-header">
          <h2>The Pyramid Puzzle</h2>
          <p>
            The <b> pyramid puzzle </b> involves placing <b> 12 </b> unique
            shapes made of connected spheres onto a <b> pyramid </b> board. Your
            goal is to fit all pieces perfectly into the grid. Each shape is
            made from a different configuration of spheres, and you can use the{" "}
            <b> Solve </b>
            button to find the best way to complete the board.
          </p>
        </div>
        <div
          style={{
            height: "50vh",
          }}
        >
          <PyramidBoard
            board={board}
            highlightedCells={highlightedCells}
            selectedShape={selectedShape}
          />
        </div>
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
      </div>
      <div
        className="rightColumn"
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "50%",
          display: "grid",
          gridTemplateRows: "auto",
          gridGap: "1rem",
        }}
      >
        <PieceSelector3D
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
        <ProgressBar
          current={12 - shapes.length}
          total={12}
          variant="pyramid"
        />
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            spaceBetween: "1rem",
          }}
        >
          <PyramidLayerBoards
            board={board}
            highlightedCells={highlightedCells}
            handleMouseEnterCell={handleMouseEnterCell}
            handleMouseLeaveCell={handleMouseLeaveCell}
            handleMouseClickCell={handleMouseClickCell}
          />
          <KeyboardControls
            keyMap={[
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
                description: "Solve (placeholder)",
                onClick: handleSolve,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default PyramidPuzzle;
