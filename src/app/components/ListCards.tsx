import "../styles/app.scss";
import {FaPencilAlt} from "react-icons/fa";
import {FaTrash} from "react-icons/fa";
import { deleteList } from "@/dbFunctions/dbFunctions";
export default function ListCards({name,tasks,listId}){
    
    return(
        <div className="listCard">
            <p className="listCard_name">{name}</p>
            <div className="listCard_statsContainer">
            
            </div>
            <div className="listCard_actions">
                <div className="listCard_actions_edit">
                    <FaPencilAlt size={18} color="white"/>
                </div>
                <div onClick={()=>{deleteList(listId)}} className="listCard_actions_delete">
                    <FaTrash size={18} color="white"/>
                </div>
            </div>
        </div>
    )
}