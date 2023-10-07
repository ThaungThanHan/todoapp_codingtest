import "../styles/app.scss";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {FaPencilAlt} from "react-icons/fa";
import {FaTrash} from "react-icons/fa";
import { deleteList } from "@/dbFunctions/dbFunctions";
export default function ListCards({list,setIsEditing,setEditData}){
    ChartJS.register(ArcElement, Tooltip, Legend);
    const chartData = {
        labels:['Pending Tasks','Done Tasks'],
        datasets:[
            {
                label:'No. of tasks',
                data:[list.unfinishedTasks,list.finishedTasks],
                backgroundColor:[
                    'rgba(224, 42, 42)',
                    'rgba(55, 215, 178)',
                ]
            }
        ]

    }
    return(
        <div className="listCard">
            <p className="listCard_name">{list.listName}</p>
            <div className="listCard_statsContainer">
                <Doughnut data={chartData} />
            </div>
            <div className="listCard_actions">
                <div onClick={()=>{setIsEditing(true),setEditData({
                    name:list.listName,
                    tasks:list.tasks,
                    listId:list._id
                })}} className="listCard_actions_edit">
                    <FaPencilAlt size={18} color="white"/>
                </div>
                <div onClick={()=>{deleteList(list._id)}} className="listCard_actions_delete">
                    <FaTrash size={18} color="white"/>
                </div>
            </div>
        </div>
    )
}