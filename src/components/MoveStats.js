const MoveStats = ({move}) => {

    return (
        <>
            <span>Competence: {move.competence}</span>
            <span>Precision: {move.precision}</span>
        </>
    );
}

export default MoveStats;