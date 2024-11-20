function PyramidCell(props) {
  return (
    <mesh {...props}>
      <sphereGeometry args={[2.5]} />
      <meshStandardMaterial
        transparent={true}
        opacity={0.7}
        color={props.shapeValue === 0 ? "#ffffff" : "#ff0000"}
      />
    </mesh>
  );
}

export default PyramidCell;
