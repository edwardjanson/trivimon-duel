import './AttackInfo.css';

const AttackInfo = ({selectedMove, playerTrivimonName, computerTrivimonName}) => {

    return (
        <>
        {selectedMove ? 
            <span>{playerTrivimonName} uses {selectedMove.name} on {computerTrivimonName}</span>
        :
        ""
        }
        </>
        
    );
}

export default AttackInfo;