import React, {useEffect,useState} from "react";
import {FaPlus} from "react-icons/fa6";
import {FaTrash} from "react-icons/fa6";
import { addListToDB } from "@/dbFunctions/dbFunctions";
export default function CreateTasks(){

    interface listState{
        listName:string,
        tasks:object[]
    }
    const [list,setList] = useState<listState>({
        listName:"",
        tasks:[]
    })
    const [taskToAdd,setTaskToAdd] = useState("");
    const [hoveredTask,setHoveredTask] = useState(null);
    const onChangeName = (e:any) => {
        setList(prevList =>({
            ...prevList,
            listName:e.target.value,
        }))
    }
    const onAddTasks = (task: string) => {
        setList((prevList)=>({
            ...prevList,
            tasks:[...prevList.tasks, {
                "id":list.tasks.length + 1,
                "task":task
            }]
        }))
        setTaskToAdd("");
      };
    
    const deleteFromList = (taskId:BigInteger) =>{
        const updatedList = list.tasks.filter(task=>task.id != taskId);
        setList((prevList)=>({
            ...prevList,
            tasks:updatedList
        }))
    }

    return(
        <div className="createTasks">
            {/* <p className="createTasks_title">Create a list</p> */}
            <input value={list.listName} name="listName"
            onChange={(e)=>onChangeName(e)}
            className="createTasks_nameInput" placeholder="Enter list name"/>
            <div className="createTasks_inputContainer">
                <input name="task" 
                onChange={(e)=>setTaskToAdd(e.target.value)} value={taskToAdd}
                placeholder="Enter task" className="createTasks_inputContainer_input" />
                <div onClick={()=>onAddTasks(taskToAdd)}
                className="createTasks_inputContainer_addBtn">
                    <FaPlus size={30} />
                </div>
            </div>
            <div className="createTasks_tasksContainer">
                {list.tasks.map(task=>(
                    <div onMouseEnter={()=>setHoveredTask(task.id)}
                    onMouseLeave={()=>setHoveredTask(null)}
                    className="createTasks_tasksContainer_tasks" key={task.id}>
                        <p className="createTasks__tasksContainer_tasks_tasksText">
                            {task.task && task.task}
                        </p>
                        <div onClick={()=>deleteFromList(task.id)} 
                        className={task.id == hoveredTask ? "createTasks_tasksContainer_tasks_tasksDeleteShown"
                        : "createTasks_tasksContainer_tasks_tasksDeleteHidden"}
                        >
                            <FaTrash 
                            size={25} />
                        </div>
                    </div>
                ))}

            </div>
            <button onClick={()=>addListToDB(list)} className="createTasks_submit">
                <p>Create</p>
            </button>
        </div>
    )
}