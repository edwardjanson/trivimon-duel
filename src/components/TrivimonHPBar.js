import './TrivimonHPBar.css';

const TrivimonHPBar = ({hp, hpLeft}) => {

    return <progress className="hpBar" value={hpLeft} max={hp}/>
}

export default TrivimonHPBar;