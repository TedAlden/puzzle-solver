/**
 * Creates a pyramid solver web-worker. To initialise the worker, a message
 * must be sent containing the pyramid board to be solved. The worker will
 * post a message containing each solution as it finds it, until it has
 * exhausted all possibilities.
 *
 * @returns {Worker} The Pyramid solver worker.
 */
import pyramidPuzzleSolver from "../lib/pyramidPuzzleSolver";

export default function createPyramidWorker() {
  const workerCode = `
    self.addEventListener('message', e => {
      // Receive the partial board configuration/placement (from the
      // front-end) to be solved
      const { board, pieces } = e.data;
      // Determine the pieces left over to complete the puzzle
      const unusedPieces = pieces.filter(piece =>
        !board.some(row => row.includes(piece.symbol))
      );
      // Run the polysphere solving algorithm
      (${pyramidPuzzleSolver.toString()})(board, unusedPieces, (solution) => {
        console.table(solution);
        // Send each solution back to the React component (front end)
        self.postMessage({ type: 'solution', data: solution });
      });
      // Tell the front-end when the solver is complete
      self.postMessage({ type: 'complete' });
    });
  `;

  const blob = new Blob([workerCode], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);

  worker.onerror = (error) => {
    console.error("Worker encountered an error:", error);
  };

  return worker;
}
