'use client';
import React from "react";
import "../styles/app.scss";
import {FaPlus} from "react-icons/fa6";
import {FaArrowLeft} from "react-icons/fa6";

import ListCard from "./ListCards";
import CreateTasks from "./CreateTasks";

export default function ToDoLists(){
    const [isCreating,setIsCreating] = React.useState(false);

    return(
        <div className="lists">
            <div className="lists_titleContainer">
                <p className="lists_titleContainer_title">Task Lists </p>
                {isCreating ?
                    <div onClick={()=>setIsCreating(!isCreating)}
                    style={{backgroundColor:"red"}}  className="lists_titleContainer_create">
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
            <div className="lists_container">
                {isCreating ? 
                    <CreateTasks /> :
                    <ListCard/>
                }
            </div>
        </div>
    )
}