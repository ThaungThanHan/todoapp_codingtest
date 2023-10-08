import "../styles/app.scss";
import React, {useEffect,useState} from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {FaPencilAlt} from "react-icons/fa";
import {FaTrash} from "react-icons/fa";
import { deleteList } from "@/dbFunctions/dbFunctions";
import DeleteModal from "./deleteModal";
import {toast} from 'react-hot-toast';

export default function ListCards({list,setIsEditing,setEditData}){
    const [isModal,setIsModal] = useState(false);
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

    const handleDelete = (list:any) => {
        const loadingToast = toast.loading('Deleting...');
        deleteList(list._id).then(res=>{
            toast.dismiss(loadingToast);
            toast.success("Task list deleted!",{
                duration:2000,
                icon:"🗑"
            });
            setIsModal(false);
        })
    }
    return(
        <div className="listCard">
            <DeleteModal handleDelete={handleDelete}
            setIsModal={setIsModal} isModal={isModal}
            list={list} />
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
                <div onClick={()=>{setIsModal(true)}} className="listCard_actions_delete">
                    <FaTrash size={18} color="white"/>
                </div>
            </div>
        </div>
    )
}