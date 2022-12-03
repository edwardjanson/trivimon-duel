import './AttackInfo.css';
import Typewriter from 'typewriter-effect';

<span></span>

const AttackInfo = ({selectedMove, playerTrivimonName, computerTrivimonName, textFinished}) => {

    return (
        <>
        {selectedMove ? 
            <Typewriter
                options={{
                    cursor: '',
                    delay: 20
                }}
                onInit={(typewriter) => {
                    typewriter.typeString(`${playerTrivimonName} uses ${selectedMove.name} on ${computerTrivimonName}`)
                    .callFunction(() => textFinished(true))
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