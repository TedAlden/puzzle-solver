import './PolyCell.css';

function PolyCell({
  onMouseEnter,
  onMouseLeave,
  onMouseClick,
  highlighted,
  value
}) {
  return (
    <div
      role="cell"
      data-testid="cell"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onMouseClick}
      className={`polyboard-cell ${highlighted > 0 ? 'highlighted' : ''} ${value}`}
    >
    </div>
  );
}

export default PolyCell;
