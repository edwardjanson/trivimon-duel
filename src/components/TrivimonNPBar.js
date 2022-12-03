import './TrivimonNPBar.css';

const TrivimonNPBar = ({np, npLeft}) => {

    return <progress className="npBar" value={npLeft} max={np}/>
}

export default TrivimonNPBar;