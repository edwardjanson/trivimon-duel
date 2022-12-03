import { useState } from 'react';
import MoveStats from './MoveStats';
import AttackInfo from './AttackInfo';
import './InfoBoard.css';

const InfoBoard = ({playerTrivimonName, 
                    computerTrivimonName, 
                    moves, 
                    selectedMove, 
                    onMoveSelection, 
                    textFinished,
                    onMoveHover,
                    moveHovered}) => {


    const moveItems = moves.map((move, index) => {
        return <li key={index} >
                    <button className="moveButton" key={index}  
                        onClick={() => onMoveSelection(move)} 
                        onMouseEnter={()=> onMoveHover(move)}
                        onMouseLeave={()=> onMoveHover(null)} 
                        >{move.name}
                    </button>
                </li>
    })

    return (
        <div className="Info-Board">
            {!selectedMove ?
                <div className="MoveDetails">
                    <ul className="Moves">
                        {moveItems}
                    </ul>
                    <div className="MoveStats">
                        {!moveHovered ? "" :
                            <MoveStats move={moveHovered}/>
                        }
                    </div>
                </div>
            :
                <div className="Attack-Info">
                    <AttackInfo 
                        selectedMove={selectedMove} 
                        playerTrivimonName={playerTrivimonName} 
                        computerTrivimonName={computerTrivimonName}
                        textFinished={textFinished}
                        />
                </div>
            }   
        </div>

    );
}

export default InfoBoard;