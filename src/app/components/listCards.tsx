import "../styles/app.scss";
import React, {useEffect,useState} from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {FaPencilAlt} from "react-icons/fa";
import {FaTrash} from "react-icons/fa";
import { deleteList } from "@/dbFunctions/dbFunctions";
import DeleteModal from "./deleteModal";
import {toast} from 'react-hot-toast';

type Task = {
    id:string,
    status:string,
}

type listCardsProps = {
    list: {
        _id:string,
        listName:string,
        tasks:Task[],
        listId:string,
        unfinishedTasks:number,
        finishedTasks:number,
    },
    setIsEditing:(isEditing:boolean) => void;
    setEditData:(editData:any) => void;
}

export default function ListCards({list,setIsEditing,setEditData}:listCardsProps){
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

    const handleDelete = async(list:any) => {
        const loadingToast = toast.loading('Deleting...');
        const result = await deleteList(list._id);
        if(result?.error){
            toast.dismiss(loadingToast);
            toast.error(result.error)
        }else{
            toast.dismiss(loadingToast);
            toast.success("Task list deleted!",{
                duration:2000,
                icon:"🗑"
            });
            setIsModal(false);
        }
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
                    listId:list._id,
                    unfinishedTasks:list.unfinishedTasks,
                    finishedTasks:list.finishedTasks
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