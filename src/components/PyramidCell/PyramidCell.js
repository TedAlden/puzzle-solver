const COLOURS = {
  a: "#ff0000",
  b: "#dd4080",
  c: "#ee8fbf",
  d: "#1046bb",
  e: "#ffff00",
  f: "#a934cc",
  g: "#5c00a7",
  h: "#2ca350",
  i: "#b64816",
  j: "#005a1e",
  k: "#e78e3a",
  l: "#0091d4",
};

function PyramidCell({ position, shapeSymbol, isHighlighted, selectedShape }) {
  const hasShapePlaced = shapeSymbol !== "";

  const colour = hasShapePlaced
    ? COLOURS[shapeSymbol.toLowerCase()]
    : isHighlighted
    ? COLOURS[selectedShape.symbol.toLowerCase()]
    : "#ffffff";

  return (
    <mesh position={position}>
      <sphereGeometry args={[2.5]} />
      <meshStandardMaterial
        transparent={true}
        opacity={hasShapePlaced ? 0.9 : 0.5}
        color={colour}
      />
    </mesh>
  );
}

export default PyramidCell;
