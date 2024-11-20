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

function PyramidCell({ position, shapeSymbol, isHighlighted }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[2.5]} />
      <meshStandardMaterial
        transparent={true}
        opacity={isHighlighted ? 1 : 0.7}
        color={
          shapeSymbol
            ? COLOURS[shapeSymbol.toLowerCase()]
            : isHighlighted
            ? "#ff0000"
            : "#ffffff"
        }
      />
    </mesh>
  );
}

export default PyramidCell;
