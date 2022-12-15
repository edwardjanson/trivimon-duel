import './TrivimonImage.css';
import { Pixelify } from "react-pixelify";

const TrivimonImage = ({image}) => {

    return <Pixelify pixelSize={18} src={image} c
                    className={image.includes("back") ? "Player" : "Computer"}
            />
}

export default TrivimonImage;