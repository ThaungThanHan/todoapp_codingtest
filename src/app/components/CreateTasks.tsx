import React, {useEffect,useState} from "react";
import {FaPlus} from "react-icons/fa6";
import {FaTrash} from "react-icons/fa6";
import { uuid } from 'uuidv4';
import {toast} from 'react-hot-toast';
import { addListToDB } from "@/dbFunctions/dbFunctions";


export default function CreateTasks({setIsCreating}){

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
                "id":uuid(),
                "task":task,
                "status":"unfinished"
            }],
        }))
        setTaskToAdd("");
      };
    
    const handleCreateTasks = async(list:any) => {
        const loadingToast = toast.loading('Creating...');
        await addListToDB(list).then(res=>{
            toast.dismiss(loadingToast);
            toast.success("Task list created!",{
                duration:2000,
                icon:"🎉"
            });
            setTimeout(()=>{setIsCreating(false)},2000);
        }).catch(err=>{
            toast.error(err);
        })
        
    }
    const deleteFromList = (taskId:BigInteger) =>{
        const updatedList = list.tasks.filter(task=>task.id != taskId);
        setList((prevList)=>({
            ...prevList,
            tasks:updatedList,
        }))
    }

    return(
        <div className="createTasks">
            {/* <p className="createTasks_title">Create a list</p> */}
            <input value={list.listName} name="listName"
            onChange={(e)=>onChangeName(e)}
            className="createTasks_nameInput" placeholder="Enter list name"/>
            <div className="createTasks_inputContainer">
                <input name="task" onKeyDown={e => {
                    if(taskToAdd.length > 0 && e.key == "Enter"){
                        onAddTasks(taskToAdd);
                    }
                }}
                onChange={(e)=>setTaskToAdd(e.target.value)} value={taskToAdd}
                placeholder="Enter task" className="createTasks_inputContainer_input" />
                <div onClick={()=>{taskToAdd.length > 0 ? onAddTasks(taskToAdd) : null}}
                className={taskToAdd.length > 0 ? "createTasks_inputContainer_addBtn":
                "createTasks_inputContainer_addBtnDisabled"}>
                    <FaPlus size={30} color="white" />
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
            <button onClick={()=>{
                list.listName.length > 0 && list.tasks.length > 0 ?
                    handleCreateTasks(list) :
                    null
            }} className={list.listName.length > 0 && list.tasks.length > 0 ? "createTasks_submit" :
            "createTasks_submit_disabled"}>
                <p>Create</p>
            </button>
        </div>
    )
}