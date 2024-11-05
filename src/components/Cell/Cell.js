import './Cell.css';
import { useState } from 'react';

/**
 * A cell for the NQueen's board. The cell can display a queen icon and changes
 * appearance based on hover, click, and board position.
 * 
 * @param {Object} props Component properties.
 * @param {boolean} props.isEven Determines if the cell is in an even position.
 * @param {boolean} props.isQueen Determines if the cell contains a queen.
 * @param {function} props.onMouseClick Called when the cell is clicked.
 * @returns {React.JSX.Element}
 */
function Cell({ isEven, isQueen, onMouseClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      role="cell"
      className={`board-cell ${isEven ? 'even' : 'odd'} ${isHovered ? 'hovered' : ''}`}
      onClick={onMouseClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isQueen && <span className="board-queen">♛</span>}
    </div>
  )
}

export default Cell;
