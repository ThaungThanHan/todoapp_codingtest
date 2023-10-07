'use client';
import React, {useEffect,useState} from "react";
import "../styles/app.scss";
import {FaPlus} from "react-icons/fa6";
import {FaArrowLeft} from "react-icons/fa6";
import ClipLoader from "react-spinners/ClipLoader";

import ListCard from "./ListCards";
import CreateTasks from "./CreateTasks";
import EditTasks from "./EditTasks";
import { getLists } from "@/dbFunctions/dbFunctions";

export default function ToDoLists(){
    const [isCreating,setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData,setEditData] = useState({});
    const [isFetching, setIsFetching] = useState(true);
    const [lists,setLists] = useState([]);
    useEffect(()=>{
        setIsFetching(true)
        getLists().then(result=>{
            const returnedLists = result
            setLists(returnedLists);
        });
    },[lists])
    return(
        <div className="lists">
            <div className="lists_titleContainer">
                <p className="lists_titleContainer_title">
                    {lists.length > 0 ? `You have ${lists.length} to-do lists!` : "You have no tasks"}
                </p>
                {isCreating || isEditing ?
                    <div onClick={()=>{setIsCreating(false),setIsEditing(false)}}
                    className="lists_titleContainer_return">
                        <p className="lists_titleContainer_create_text">
                            Return
                        </p>
                        <FaArrowLeft size={25} color="white" />
                    </div>
                    :
                    <div onClick={()=>setIsCreating(!isCreating)} className="lists_titleContainer_create">
                        <p onClick={()=>setIsCreating(true)} className="lists_titleContainer_create_text">
                            Create tasks
                        </p>
                        <FaPlus size={25} color="white" />
                    </div>
                }
            </div>
            <div >
                {isCreating ? 
                    <CreateTasks setIsCreating={setIsCreating} /> : isEditing ?
                    <EditTasks editData={editData} setIsEditing={setIsEditing} /> :
                    <div className="lists_container">
                        {lists.length > 0 ? lists.map(list=>(
                            <ListCard key={list._id} setIsEditing={setIsEditing} setEditData={setEditData}
                            list={list} />
                        )) : 
                        <p className="lists_container_emptyList">
                            {isFetching ? 
                                  <ClipLoader
                                  color="red"
                                  loading={isFetching}
                                />
                            :
                            `Your list is empty. Click "Create tasks" to create a to-do list.`
                            }
                        </p>
                        }
                    </div>
                }
            </div>
        </div>
    )
}