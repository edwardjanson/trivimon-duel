import { useState } from 'react';
import MoveStats from './MoveStats';
import AttackInfo from './AttackInfo';
import './InfoBoard.css';

const InfoBoard = ({playerTrivimonName, computerTrivimonName, moves, selectedMove, onMoveSelection}) => {

    const [moveHovered, changeMoveHovered] = useState(null);

    const moveItems = moves.map((move, index) => {
        return <li key={index} >
                    <button className="moveButton" key={index}  
                        onClick={() => onMoveSelection(move)} 
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
                    <AttackInfo selectedMove={selectedMove} playerTrivimonName={playerTrivimonName} computerTrivimonName={computerTrivimonName}/>
                </div>
            }   
        </div>

    );
}

export default InfoBoard;