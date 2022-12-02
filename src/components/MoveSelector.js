import { useState, useEffect } from 'react';
import './MoveSelector.css';

const MoveSelector = ({moves, onSelection}) => {

    const [moveHovered, changeMoveHovered] = useState(null);

    const onHover = (move) => {
        changeMoveHovered(move);
    }

    const moveItems = moves.map((move, index) => {
        return <li key={index} >
                    <button className="moveButton" key={index}  
                        onClick={onSelection(move)} 
                        onMouseEnter={()=> onHover(move)}
                        onMouseLeave={()=> onHover(null)} 
                        >{move.name}
                    </button>
                </li>
    })

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