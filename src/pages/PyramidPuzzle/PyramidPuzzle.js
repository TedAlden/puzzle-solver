import "./PyramidPuzzle.css";
import ProgressBar from "../../components/Shared/ProgressBar/ProgressBar";
import PieceSelector from "../../components/Shared/PieceSelector/PieceSelector";
import PyramidBoard from "../../components/PyramidBoard/PyramidBoard";
import PyramidLayerBoards from "../../components/PyramidLayerBoards/PyramidLayerBoards";
import KeyboardControls from "../../components/Shared/KeyboardControls/KeyboardControls";
import usePyramidPuzzle from "../../hooks/usePyramidPuzzle";

// TODO: add x,y,z guide lines

function PyramidPuzzle() {
  const {
    board,
    highlightedCells,
    selectedShape,
    shapes,
    handleRotatePiece,
    handleFlipPiece,
    handleNextPiece,
    handlePreviousPiece,
    handleClear,
    handleUndo,
    handleSolve,
    handleMouseEnterCell,
    handleMouseLeaveCell,
    handleMouseClickCell,
  } = usePyramidPuzzle();

  return (
    <div className="puzzleThree">
      <h2>The Pyramid Puzzle</h2>
      <p>
        The <b> pyramid puzzle </b> involves placing <b> 12 </b> unique shapes
        made of connected spheres onto a <b> pyramid </b> board. Your goal is to
        fit all pieces perfectly into the grid. Each shape is made from a
        different configuration of spheres, and you can use the <b> Solve </b>
        button to find the best way to complete the board.
      </p>
      <ProgressBar current={12 - shapes.length} total={12} variant="pyramid" />
      {shapes.length > 0 && (
        <PieceSelector
          selectedShape={selectedShape}
          handleFlipShape={handleFlipPiece}
          handlePreviousShape={handlePreviousPiece}
          handleNextShape={handleNextPiece}
          handleRotateShape={handleRotatePiece}
        />
      )}
      <div className="pyramid-area">
        <PyramidBoard
          board={board}
          highlightedCells={highlightedCells}
          selectedShape={selectedShape}
        />
        <PyramidLayerBoards
          board={board}
          highlightedCells={highlightedCells}
          handleMouseEnterCell={handleMouseEnterCell}
          handleMouseLeaveCell={handleMouseLeaveCell}
          handleMouseClickCell={handleMouseClickCell}
        />
      </div>
      <KeyboardControls
        keyMap={[
          {
            key: "r",
            keyAlias: "R",
            description: "Rotate piece",
            onClick: handleRotatePiece,
          },
          {
            key: "f",
            keyAlias: "F",
            description: "Flip piece",
            onClick: handleFlipPiece,
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
  );
}

export default PyramidPuzzle;
