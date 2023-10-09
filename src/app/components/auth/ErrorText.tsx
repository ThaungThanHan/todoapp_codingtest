import {FaCircleExclamation} from "react-icons/fa6";
import "../../styles/auth.scss";

type errorTextProps = {
    text:string
}

export default function ErrorText({text}:errorTextProps){
    return(
        <p className="auth_form_input_errorText">
            <FaCircleExclamation className="auth_form_input_errorText_icon"
            color="red" size={14}/>{text}
        </p>
    )
}