/**
 * Creates a pyramid solver web-worker. To initialise the worker, a message
 * must be sent containing the pyramid board to be solved. The worker will
 * post a message containing each solution as it finds it, until it has
 * exhausted all possibilities.
 *
 * @returns {Worker} The Pyramid solver worker.
 */
import pyramidPuzzleSolver from "../lib/pyramidPuzzleSolver";
import { generateAllOrientations } from "../lib/utils";

export default function createPyramidWorker() {
  const workerCode = `
    // Worker listener
    self.addEventListener('message', (e) => {
      console.log("Worker received message:", e.data);

      const { board, pieces3D } = e.data;
      const generateAllOrientations = ${generateAllOrientations.toString()};


      // Ensure data is valid
      if (!board || !Array.isArray(board)) {
        console.error("Invalid board data received:", board);
        self.postMessage({ type: 'error', message: 'Invalid board data.' });
        return;
      }
      if (!pieces3D || !Array.isArray(pieces3D)) {
        console.error("Invalid pieces data received:", pieces3D);
        self.postMessage({ type: 'error', message: 'Invalid pieces data.' });
        return;
      }

      // Log the inputs for debugging
      console.log("Board data in worker:", board);
      console.log("Pieces data in worker:", pieces3D);

      // Run the pyramid solving algorithm
      (${pyramidPuzzleSolver.toString()})(board, pieces3D, (solution) => {
        console.table(solution);
        // Send each solution back to the React component (front end)
        self.postMessage({ type: 'solution', data: solution });
      });

      // Notify the main thread when solving is complete
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
