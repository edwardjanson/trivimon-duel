import { useState, useEffect } from 'react';

import './MoveSelector.css';

const MoveSelector = ({moves, onSelection}) => {

    // const [moveHovered, changeMoveHovered] = useState(null);

    // const onHover = (move) => {
    //     changeMoveHovered(move);
    // }

    const moveItems = moves.map((move, index) => {
        return <li value={move.name} key={index}>{move.name}</li> 
        // onMouseHover={onHover(move)} 
        // onClick={onSelection(move)}
    })

    return (
        <div className="MoveDetails">
            <ul className="Moves">
                {moveItems}
            </ul>
            {/* <div>
                {!moveHovered ? "" :
                <>
                    <span>Trivia Power: {moveHovered.power}</span>
                    <span>Accuracy: {moveHovered.accuracy}</span>
                </>
                }
            </div> */}
        </div>
    );
}

export default MoveSelector;