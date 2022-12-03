const MoveStats = ({move}) => {

    return (
        <>
            <span>Trivia Power: {move.power}</span>
            <span>Accuracy: {move.accuracy}</span>
        </>
    );
}

export default MoveStats;