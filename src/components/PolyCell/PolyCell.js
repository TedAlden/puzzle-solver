import "./PolyCell.css";

/**
 * A cell in the polysphere puzzle grid. The cell can respond to hover and
 * click events.
 *
 * @param {Object} props Component properties.
 * @param {function} props.onMouseEnter Called when the mouse enters the cell.
 * @param {function} props.onMouseLeave Called when the mouse leaves the cell.
 * @param {function} props.onMouseClick Called when the cell is clicked.
 * @param {number} props.highlighted Determines if the cell should be
 *  highlighted.
 * @param {string} props.value A string representing the symbol of the piece
 *  placed in this cell.
 * @returns {JSX.Element}
 */
function PolyCell({
  onMouseEnter,
  onMouseLeave,
  onMouseClick,
  highlighted,
  value,
}) {
  return (
    <div
      role="cell"
      data-testid="cell"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onMouseClick}
      className={`polyboard-cell ${
        highlighted > 0 ? "highlighted" : ""
      } ${value}`}
    ></div>
  );
}

export default PolyCell;
