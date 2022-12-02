import './TrivimonImage.css';

const TrivimonImage = ({image}) => {

    return <img src={image} className={image.includes("back") ? "Player" : "Computer"}/>
}

export default TrivimonImage;