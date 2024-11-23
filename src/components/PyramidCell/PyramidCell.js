function PyramidCell({ position, colour, opacity }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[2.5]} />
      <meshStandardMaterial
        transparent={true}
        opacity={opacity}
        color={colour}
      />
    </mesh>
  );
}

export default PyramidCell;
