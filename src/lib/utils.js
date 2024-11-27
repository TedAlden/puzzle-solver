/**
 * Normalizes an array of shape coordinates by shifting them so that the
 * top-left corner is at (0, 0).
 *
 * @param {Array<Array<number>>} coords An array of [row, col] coordinates.
 * @returns {Array<Array<number>>} The adjusted array of coordinates.
 */
export const normaliseShape = (coords) => {
  const minRow = Math.min(...coords.map(([r, _]) => r));
  const minCol = Math.min(...coords.map(([_, c]) => c));
  return coords.map(([r, c]) => [r - minRow, c - minCol]);
};

/**
 * Normalizes an array of 3D shape coordinates by shifting them so that the
 * top-left corner is at (0, 0, 0).
 *
 * @param {Array<Array<number>>} coords An array of [row, col] coordinates.
 * @returns {Array<Array<number>>} The adjusted array of coordinates.
 */
export const normaliseShape3D = (coords) => {
  const minX = Math.min(...coords.map(([x]) => x));
  const minY = Math.min(...coords.map(([_, y]) => y));
  const minZ = Math.min(...coords.map(([_, __, z]) => z));

  const normalisedCoords = coords.map(([x, y, z]) => [x - minX, y - minY, z - minZ]);
  console.log("Normalised coords:", normalisedCoords);
  return normalisedCoords;
};


/**
 * Rotates an array of shape coordinates 90 degrees counter-clockwise.
 *
 * @param {Array<Array<number>>} coords An array of [row, col] coordinates.
 * @returns {Array<Array<number>>} The rotated array of coordinates.
 */
export const rotateShapeCCW = (coords) => {
  return coords.map(([r, c]) => [c, -r]);
};

/**
 * Rotates an array of 3D shape coordinates 60 degrees about the X axis.
 *
 * @param {Array<Array<number>>} coords An array of [x, y, z] coordinates.
 * @returns {Array<Array<number>>} The rotated array of coordinates.
 */
export const rotateShapeX = (coords) => {
  return coords.map(([x, y, z]) => [x, -z, y]);
};

/**
 * Rotates an array of 3D shape coordinates 90 degrees about the Y axis.
 *
 * @param {Array<Array<number>>} coords An array of [x, y, z] coordinates.
 * @returns {Array<Array<number>>} The rotated array of coordinates.
 */
export const rotateShapeY = (coords) => {
  return coords.map(([x, y, z]) => [z, y, -x]);
};

/**
 * Rotates an array of 3D shape coordinates 60 degrees about the Z axis.
 *
 * @param {Array<Array<number>>} coords An array of [x, y, z] coordinates.
 * @returns {Array<Array<number>>} The rotated array of coordinates.
 */
export const rotateShapeZ = (coords) => {
  return coords.map(([x, y, z]) => [-y, x + y, z]);
};

/**
 * Flips an array of shape coordinates horizontally.
 *
 * @param {Array<Array<number>>} coords An array of [row, col] coordinates.
 * @returns {Array<Array<number>>} The flipped array of coordinates.
 */
export const flipShapeHorizontal = (coords) => {
  return coords.map(([r, c]) => [-r, c]);
};

/**
 * Flips an array of 3D shape coordinates along the X axis.
 *
 * @param {Array<Array<number>>} coords An array of [x, y, z] coordinates.
 * @returns {Array<Array<number>>} The flipped array of coordinates.
 */
export const flipShapeX = (coords) => {
  return coords.map(([x, y, z]) => [-x, y, z]);
};

/**
 * Flips an array of 3D shape coordinates along the Y axis.
 *
 * @param {Array<Array<number>>} coords An array of [x, y, z] coordinates.
 * @returns {Array<Array<number>>} The flipped array of coordinates.
 */
export const flipShapeY = (coords) => {
  return coords.map(([x, y, z]) => [x, -y, z]);
};

/**
 * Flips an array of 3D shape coordinates along the Z axis.
 *
 * @param {Array<Array<number>>} coords An array of [x, y, z] coordinates.
 * @returns {Array<Array<number>>} The flipped array of coordinates.
 */
export const flipShapeZ = (coords) => {
  return coords.map(([x, y, z]) => [x, y, -z]);
};

/**
 * Creates a 2D array representing a puzzle board, each cell initially holding a
 * specified value.
 *
 * @param {number} width The number of columns in the board.
 * @param {number} height The number of rows in the board.
 * @param {*} value The initial value to fill the board with.
 * @returns {Array<Array<*>>} A 2D array representing the board.
 * @example
 * createBoard2D(4, 3, "");
 * // Returns:
 * // [
 * //   ["", "", "", ""],
 * //   ["", "", "", ""],
 * ///  ["", "", "", ""]
 * // ]
 */
export const createBoard2D = (width, height, value) => {
  return Array(height)
    .fill()
    .map(() => Array(width).fill(value));
};

/**
 * Creates a 3D array representing a pyramid puzzle board, each cell initially
 * holding a specified value.
 *
 * @param {number} size The size of the pyramid.
 * @param {*} value The initial value to fill the board with.
 * @returns {Array<Array<Array<*>>>} A 3D array representing the pyramid.
 * @example
 * createBoardPyramid(3);
 * // Returns:
 * // [
 * //   [["", "", ""], ["", "", ""], ["", "", ""]],
 * //   [["", ""], ["", ""]],
 * //   [[""]]
 * // ]
 */
export const createBoardPyramid = (size, value) => {
  return Array.from({ length: size }, (_, i) =>
    Array.from({ length: size - i }, () => Array(size - i).fill(value))
  );
};
/**
 * Converts 2D coordinates to 3D by adding a y-coordinate.
 * Defaults to placing the piece on the y = 0 plane.
 *
 * @param {Array<Array<number>>} coords - The 2D coordinates ([x, z]) of a piece.
 * @param {number|Array<number>} yMapping - The y-coordinate to assign for all points.
 *    Can be a single number (e.g., 0) or an array of y-levels for each point.
 * @returns {Array<Array<number>>} The 3D coordinates ([x, y, z]) of the piece.
 */
export const convert2Dto3D = (coords, yMapping = 0) => {
  return coords.map(([x, z], index) => [
    x,
    Array.isArray(yMapping) ? yMapping[index] : yMapping, // Use yMapping array if provided
    z,
  ]);
};

/**
 * Generate all unique orientations for a 3D shape.
 *
/**
 * @param {Array<Array<number>>} coords The 3D coordinates of the piece.
 * @returns {Array<Array<Array<number>>>} An array of unique orientations.
 */
export const generateAllOrientations = (coords) => {
  const orientations = new Set();
  const stringifyCoords = (coords) => JSON.stringify(normaliseShape3D(coords));

  const transformations = [
    (shape) => shape, // No transformation
    flipShapeX,
    flipShapeY,
    flipShapeZ,
  ];

  for (const flip of transformations) {
    let flippedCoords = flip(coords); // Apply a flip transformation

    for (let rx = 0; rx < 4; rx++) {
      for (let ry = 0; ry < 4; ry++) {
        for (let rz = 0; rz < 4; rz++) {
          let transformedCoords = flippedCoords;
          for (let i = 0; i < rx; i++) transformedCoords = rotateShapeX(transformedCoords);
          for (let i = 0; i < ry; i++) transformedCoords = rotateShapeY(transformedCoords);
          for (let i = 0; i < rz; i++) transformedCoords = rotateShapeZ(transformedCoords);

          orientations.add(stringifyCoords(transformedCoords));
        }
      }
    }
  }

  const uniqueOrientations = Array.from(orientations).map((coords) => JSON.parse(coords));
  console.log("Unique orientations with flips:", uniqueOrientations);
  return uniqueOrientations;
};


