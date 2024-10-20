import NQueenPuzzle from './components/NQueenPuzzle/NQueenPuzzle';
import PolyspherePuzzle from './components/PolyspherePuzzle';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">   
        <h2>Welcome to the puzzle solver!</h2>
      </header>
      <NQueenPuzzle></NQueenPuzzle>
      <PolyspherePuzzle></PolyspherePuzzle>
    </div>
  );
}

export default App;
