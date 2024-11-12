import PropTypes from "prop-types";
import "./KeyboardControls.css";
import useKeyboardInput from "../../hooks/useKeyboardInput";
import {
  flipShapeHorizontal,
  normaliseShape,
  rotateShapeCCW,
} from "../../lib/utils";

function KeyboardControls({
  selectedShape,
  setSelectedShape,
  shapes,
  isSolving,
  handleSolve,
  handleUndo,
  handleClear,
}) {
  useKeyboardInput("r", () => {
    if (!isSolving && selectedShape) {
      const newShape = { ...selectedShape };
      newShape.coords = normaliseShape(rotateShapeCCW(newShape.coords));
      setSelectedShape(newShape);
    }
  });

  useKeyboardInput("f", () => {
    if (!isSolving && selectedShape) {
      const newShape = { ...selectedShape };
      newShape.coords = normaliseShape(flipShapeHorizontal(newShape.coords));
      setSelectedShape(newShape);
    }
  });

  useKeyboardInput("ArrowLeft", () => {
    if (!isSolving && shapes.length > 0) {
      const currentIndex = shapes.findIndex(
        (shape) => shape.symbol === selectedShape.symbol
      );
      const newIndex = (currentIndex - 1 + shapes.length) % shapes.length;
      setSelectedShape(shapes[newIndex]);
    }
  });

  useKeyboardInput("ArrowRight", () => {
    if (!isSolving && shapes.length > 0) {
      const currentIndex = shapes.findIndex(
        (shape) => shape.symbol === selectedShape.symbol
      );
      const newIndex = (currentIndex + 1) % shapes.length;
      setSelectedShape(shapes[newIndex]);
    }
  });

  useKeyboardInput("Escape", () => {
    if (!isSolving) {
      handleClear();
    }
  });

  useKeyboardInput("s", () => {
    if (!isSolving) {
      handleSolve();
    }
  });

  useKeyboardInput("u", () => {
    if (!isSolving) {
      handleUndo();
    }
  });

  // Render the controls description
  return (
    <div className="keyboardControls">
      <p>Keyboard Controls</p>
      <ul>
        <li>R : Rotate piece</li>
        <li>F : Flip piece</li>
        <li>← : Previous piece</li>
        <li>→ : Next piece</li>
        <li>U : Undo</li>
        <li>S : Solve puzzle</li>
        <li>Esc : Clear board</li>
      </ul>
    </div>
  );
}

KeyboardControls.propTypes = {
  selectedShape: PropTypes.object,
  setSelectedShape: PropTypes.func.isRequired,
  shapes: PropTypes.array.isRequired,
  isSolving: PropTypes.bool.isRequired,
  handleSolve: PropTypes.func.isRequired,
  handleUndo: PropTypes.func.isRequired,
  handleClear: PropTypes.func.isRequired,
  normalise: PropTypes.func.isRequired,
};

export default KeyboardControls;
