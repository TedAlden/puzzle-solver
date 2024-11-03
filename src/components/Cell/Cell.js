import './Cell.css';
import { useState } from 'react';

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
