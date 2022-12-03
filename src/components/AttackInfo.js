import './AttackInfo.css';

const AttackInfo = ({selectedMove, playerTrivimonName, computerTrivimonName}) => {

    return (
        <>
        {selectedMove ? 
            <span className="Attack-Info">{playerTrivimonName} uses {selectedMove.name} on {computerTrivimonName}</span>
        :
        ""
        }
        </>
        
    );
}

export default AttackInfo;