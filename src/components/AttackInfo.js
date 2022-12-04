import './AttackInfo.css';
import Typewriter from 'typewriter-effect';

<span></span>

const AttackInfo = ({selectedMove, 
                    playerTrivimonName, 
                    computerTrivimonName, 
                    updateTextFinished,
                    playerAttack}) => {

    return (
        <>
        {selectedMove ? 
            <Typewriter
                options={{
                    cursor: '',
                    delay: 20,
                    skipAddStyles: true
                }}
                onInit={(typewriter) => {
                    typewriter.typeString(
                        playerAttack ?
                            `${playerTrivimonName} uses ${selectedMove.name} on ${computerTrivimonName}`
                        :
                            `${computerTrivimonName} uses ${selectedMove.name} on ${playerTrivimonName}`
                        )
                    .callFunction(() => updateTextFinished(true))
                    .start();
                }}
            />
        :
        ""
        }
        </>
        
    );
}

export default AttackInfo;