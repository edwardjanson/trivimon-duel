const MoveStats = ({move}) => {

    return (
        <>
            <span>Trivia Competence: {move.power}</span>
            <span>Precision: {move.precision}</span>
        </>
    );
}

export default MoveStats;