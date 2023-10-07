import {FaCircleExclamation} from "react-icons/fa6";
import "../../styles/auth.scss";
export default function ErrorText({text}){
    return(
        <p className="auth_form_input_errorText">
            <FaCircleExclamation className="auth_form_input_errorText_icon"
            color="red" size={14}/>{text}
        </p>
    )
}