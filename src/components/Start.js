import Typewriter from 'typewriter-effect';
import './Start.css';

const Start = ({winner, onNewGame, computerTrivimonName, onStartChange}) => {

    return (
        <div className="Start-Screen">
            <Typewriter
                options={{
                    cursor: '',
                    delay: 20,
                    skipAddStyles: true
                }}
                onInit={(typewriter) => {
                    typewriter.typeString(
                        winner ?
                            winner === "player" ?
                            `You outsmarted ${computerTrivimonName}!`
                            :
                            `${computerTrivimonName} outsmarted you!`
                        :
                            `Intro text`
                        )
                    .start();
                }}
            />
            {winner ?
                <button className="Start" onClick={onNewGame}>Play Again</button>
            :
                <button className="Start" onClick={onStartChange}>Start</button>
            }
            
        </div>
    );
}

export default Start;