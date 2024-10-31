import solvePolyspheres from "../lib/polysphereSolver";

// Workaround for issue with create-react-app and Jest. Originally was
// using code like this:
//
// `Worker(new URL('path/to/polySolver.worker.js', import.meta.url));`
//
// But Jest has issues with `import.meta.url`. I tried to fix this
// with various babel compiler extensions but none worked.
//
// This was the only solution I could get working - to manually encode
// the worker into a `Blob`.
// 
// I also had to manually embed the polysphereSolver code, as
// importing it created WEBPACK import errors.
//
// It's not pretty but it finally works...

export default function createPolysphereWorker() {
  const workerCode = `
    ${solvePolyspheres.toString()}

    self.addEventListener('message', e => {
      // Receive the partial board configuration/placement (from the
      // front-end) to be solved
      const { board, pieces } = e.data;
      // Determine the pieces left over to complete the puzzle
      const unusedPieces = pieces.filter(piece =>
        !board.some(row => row.includes(piece.symbol))
      );
      // Run the polysphere solving algorithm
      solvePolyspheres(board, unusedPieces, (solution) => {
        console.table(solution);
        // Send each solution back to the React component (front end)
        self.postMessage({ type: 'solution', data: solution });
      });
      // Tell the front-end when the solver is complete
      self.postMessage({ type: 'complete' });
    });
  `
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);
  return worker;
}
