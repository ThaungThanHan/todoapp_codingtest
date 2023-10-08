import React, {useState} from "react";
import {FaPlus,FaTrash} from "react-icons/fa6";
import { updateList } from "@/dbFunctions/dbFunctions";
import {toast} from 'react-hot-toast';
import { uuid } from 'uuidv4';

export default function EditTasks({editData, setIsEditing}){
    const [editedList,setEditedList] = useState({
        listName:editData.name,
        tasks:editData.tasks,
        listId:editData.listId,
    })

    const onChangeName = (e:any) => {
        setEditedList(prevList =>({
            ...prevList,
            listName:e.target.value,
        }))
    }
    const [taskToAdd,setTaskToAdd] = useState("");
    const [hoveredTask,setHoveredTask] = useState(null);

    const onAddTasks = (task: string) => {
        setEditedList((prevList)=>({
            ...prevList,
            tasks:[...prevList.tasks, {
                "id":uuid(),
                "task":task,
                "status":"unfinished"
            }]
        }))
        setTaskToAdd("");
      };

    const deleteFromList = (taskId:BigInteger) =>{
        const updatedList = editedList.tasks.filter(task=>task.id != taskId);
        setEditedList((prevList)=>({
            ...prevList,
            tasks:updatedList
        }))
    }  
    const handleStatusChange = (taskId) => {
        const taskIndex = editedList.tasks.findIndex((task)=>task.id == taskId);
        if(taskIndex != -1 && editedList.tasks[taskIndex].status == "finished"){
            editedList.tasks[taskIndex].status = "unfinished";
        }else if(taskIndex != -1 && editedList.tasks[taskIndex].status == "unfinished"){
            editedList.tasks[taskIndex].status = "finished";
        }
    }
    const handleUpdateList = () => {
        const loadingToast = toast.loading("Updating...")
        updateList(editData.listId, editedList).then(res=>{
            toast.dismiss(loadingToast);
            toast.success("Task list updated!",{
                duration:2000,
                icon:"🎉"
            });
            setTimeout(()=>{setIsEditing(false)},2000);
        }).catch(err=>{
            toast.dismiss(loadingToast);
            toast.error(err.message,{duration:2000});
        });
    }
    return(
        <div className="createTasks">
            {/* <p className="createTasks_title">Create a list</p> */}
            <input value={editedList.listName} name="listName"
            onChange={(e)=>onChangeName(e)}
            className="createTasks_nameInput" placeholder="Enter list name"/>
            <div className="createTasks_inputContainer">
                <input name="task" onKeyDown={e => {
                    if(e.key == "Enter"){
                        onAddTasks(taskToAdd);
                    }
                }}
                onChange={(e)=>setTaskToAdd(e.target.value)} value={taskToAdd}
                placeholder="Enter task" className="createTasks_inputContainer_input" />
                <div onClick={()=>{taskToAdd.length > 0 ? onAddTasks(taskToAdd) : null}}
                className={taskToAdd.length > 0 ? "createTasks_inputContainer_addBtn":
                "createTasks_inputContainer_addBtnDisabled"}>
                    <FaPlus size={30} color="white"/>
                </div>
            </div>
            <div className="createTasks_tasksContainer">
                {editedList && editedList.tasks.map(task=>(
                    <div onMouseEnter={()=>setHoveredTask(task.id)}
                    onMouseLeave={()=>setHoveredTask(null)}
                    className="createTasks_tasksContainer_tasks" key={task.id}>
                        <label
                            className={task.status == "finished" ?
                            "createTasks_tasksContainer_tasks_tasksTextDone" : 
                            "createTasks_tasksContainer_tasks_tasksTextUndone"}>
                        <input  type="checkbox" checked={task.status == "finished"}
                        onChange={()=>handleStatusChange(task.id)}
                        />
                        {task.task}
                        </label>
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
            <button onClick={()=>{
                editedList.listName.length > 0 && editedList.tasks.length > 0 ?
                    handleUpdateList() :
                    null
            }} className={editedList.listName.length > 0 && editedList.tasks.length > 0 ? "createTasks_submit" :
            "createTasks_submit_disabled"}>
                <p>Update</p>
            </button>

        </div>
    )
}