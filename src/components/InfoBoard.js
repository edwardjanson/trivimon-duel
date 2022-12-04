import { useState } from 'react';
import MoveStats from './MoveStats';
import AttackInfo from './AttackInfo';
import Trivia from './Trivia';
import './InfoBoard.css';

const InfoBoard = ({playerTrivimonName, 
                    computerTrivimonName, 
                    playerMoves, 
                    selectedMove, 
                    onMoveSelection, 
                    textFinished,
                    onMoveHover,
                    moveHovered,
                    playerTurn,
                    triviaToAnswer,
                    triviaAnswered,
                    changeTriviaAnswered}) => {


    const moveItems = playerMoves.map((move, index) => {
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
        {!triviaAnswered ?
            <div className="Trivia">
                <Trivia triviaToAnswer={triviaToAnswer} 
                        changeTriviaAnswered={changeTriviaAnswered}
                        textFinished={textFinished}
                />
            </div>
        :
            !playerTurn ?
                <div className="Attack-Info">
                        <AttackInfo 
                            playerAttack={false}
                            selectedMove={selectedMove}
                            playerTrivimonName={playerTrivimonName} 
                            computerTrivimonName={computerTrivimonName}
                            textFinished={textFinished}
                        />
                </div>
            :
                !selectedMove ?
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
                                playerAttack={true} 
                                selectedMove={selectedMove} 
                                playerTrivimonName={playerTrivimonName} 
                                computerTrivimonName={computerTrivimonName}
                            />
                        </div>
                }   
        </div>

    );
}

export default InfoBoard;