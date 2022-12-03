import './TrivimonImage.css';
import { Pixelify } from "react-pixelify";

const TrivimonImage = ({image}) => {

    return <Pixelify width={image.includes("back") ? 250 : 175} 
                    height={image.includes("back") ? 250 : 175} 
                    pixelSize={18} src={image} c
                    className={image.includes("back") ? "Player" : "Computer"}
            />
}

export default TrivimonImage;