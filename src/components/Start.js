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
                    winner ?
                        typewriter.typeString(
                            winner === "player" ?
                            `You outsmarted ${computerTrivimonName}!`
                            :
                            `${computerTrivimonName} outsmarted you!`
                        )
                    : typewriter.typeString(
                            `Welcome to Trivimon Duel! 
                            To win, answer questions correctly and multiply your damage/ decrease damage received. 
                            Good luck!
                            P.S. Names and moves a generated randomly :)`
                        ).start();
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