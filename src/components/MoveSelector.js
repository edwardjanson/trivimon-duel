import { useState, useEffect, useRef } from 'react';
import './MoveSelector.css';

const MoveSelector = ({moves, onSelection}) => {

    const [moveHovered, changeMoveHovered] = useState(null);

    const moveItems = moves.map((move, index) => {
        return <li key={index} >
                    <button className="moveButton" key={index}  
                        onClick={() => onSelection(move)} 
                        onMouseEnter={()=> onHover(move)}
                        onMouseLeave={()=> onHover(null)} 
                        >{move.name}
                    </button>
                </li>
    })

    const onHover = (move) => {
        changeMoveHovered(move);
    }

    return (
        <div className="MoveDetails">
            <ul className="Moves">
                {moveItems}
            </ul>
            <div className="MoveStats">
                {!moveHovered ? "" :
                    <>
                        <span>Trivia Power: {moveHovered.power}</span>
                        <span>Accuracy: {moveHovered.accuracy}</span>
                    </>
                }
            </div>
        </div>
    );
}

export default MoveSelector;