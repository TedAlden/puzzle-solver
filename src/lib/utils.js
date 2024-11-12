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
 * Rotates an array of shape coordinates 90 degrees counter-clockwise.
 *
 * @param {Array<Array<number>>} coords An array of [row, col] coordinates.
 * @returns {Array<Array<number>>} The rotated array of coordinates.
 */
export const rotateShapeCCW = (coords) => {
  return coords.map(([r, c]) => [c, -r]);
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
 * Creates a 2D array representing a puzzle board, each cell initially holding a
 * specified character.
 *
 * @param {number} width The number of columns in the board.
 * @param {number} height The number of rows in the board.
 * @param {*} value The initial value to fill the board with.
 * @returns {Array<Array<*>>} A 2D array representing the board.
 */
export const createBoard2D = (width, height, value) => {
  return Array(height)
    .fill()
    .map(() => Array(width).fill(value));
};
