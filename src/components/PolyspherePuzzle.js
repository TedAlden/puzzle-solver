import './PolyspherePuzzle.css';
import PolyBoard from './PolyBoard';
import {useState} from 'react';




function PolyspherePuzzle (){

    const [board, setBoard] = useState(Array(5).fill().map(() => Array(11).fill(0)));



return (

<div className="puzzleTwo">
    <h2>The Polysphere Puzzle</h2>
    <p>This puzzle involves placing unique shapes made of connected spheres
        onto a 5x11 board. Your goal is to fit all 12 pieces perfectly into the grid. 
        Each shape is made from a different configuration of spheres, and you can use the 
        'Solve' button to find the best way to complete the board. 
    </p>

    <PolyBoard board={board} setBoard={setBoard} /> 
</div>

)
}

export default PolyspherePuzzle;