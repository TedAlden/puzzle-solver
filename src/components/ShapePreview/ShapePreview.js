import './ShapePreview.css';

function ShapePreview ({selectedShape}) {
  const tileSize = 20; // Size of each square tile in shape preview (px)
  const previewCols = 5; // Width of preview viewport (# of tiles)
  const previewRows = 5; // Height of preview viewport (# of tiles)

  function centerCoords(shape) {
    // Find the minimum and maximum x and y values
    const minX = Math.min(...shape.map(([x, _]) => x * 2)) / 2;
    const maxX = Math.max(...shape.map(([x, _]) => x * 2)) / 2;
    const minY = Math.min(...shape.map(([_, y]) => y * 2)) / 2;
    const maxY = Math.max(...shape.map(([_, y]) => y * 2)) / 2;
    // Calculate the midpoint
    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    // Center the shape around the origin
    return shape.map(([x, y]) => [x - midX, y - midY]);
  }

  const generateShapeRects = () => {
    const coords = centerCoords(selectedShape.coords);
    const tiles = [];
    coords.forEach(([x, y]) => {
      tiles.push(
        <rect
          key={`${x}-${y}`}
          x={(x * tileSize) + (previewCols * tileSize * 0.5) - (tileSize * 0.5)}
          y={(y * tileSize) + (previewRows * tileSize * 0.5) - (tileSize * 0.5)}
          width={tileSize}
          height={tileSize}
          fill={selectedShape.colour}
        />
      )
    });
    return tiles;
  }

  return (
    <svg
      className="shapePreview"
      width={previewCols * tileSize}
      height={previewRows * tileSize}
    >
      {generateShapeRects()}
    </svg>
  );
}

export default ShapePreview;
