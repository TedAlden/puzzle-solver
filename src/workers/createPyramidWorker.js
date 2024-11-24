/**
 * Creates a pyramid puzzle solver web-worker that uses the main solver implementation
 */
import pyramidPuzzleSolver from '../lib/pyramidPuzzleSolver';

export default function createPyramidWorker() {
  const workerCode = `
    self.addEventListener('message', e => {
      const { board, pieces } = e.data;
      
      // Run the solver with a callback for solutions
      (${pyramidPuzzleSolver.toString()})(board, pieces, (solution) => {
        self.postMessage({ type: 'solution', data: solution });
      });

      self.postMessage({ type: 'complete' });
    });
  `;

  const blob = new Blob([workerCode], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);
  
  worker.onerror = (error) => {
    console.error("Worker error:", error);
  };
  
  return worker;
}