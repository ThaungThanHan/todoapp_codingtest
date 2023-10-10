'use client';
import React, {useEffect,useState} from "react";
import "../styles/app.scss";
import {FaPlus} from "react-icons/fa6";
import {FaArrowLeft} from "react-icons/fa6";
import PulseLoader from "react-spinners/PulseLoader";
import ListCard from "./listCards";
import CreateTasks from "./createTasks";
import EditTasks from "./editTasks";
import { getListsById } from "@/dbFunctions/dbFunctions";
import debounce from "lodash.debounce";

type todoListsProps = {
    currentUser: {
        _id:string
    };
}

export default function ToDoLists({currentUser}:todoListsProps){
    const [isCreating,setIsCreating] = useState<boolean | null>(false);
    const [isEditing, setIsEditing] = useState<boolean | null>(false);
    const [editData,setEditData] = useState({name:"",tasks:[],listId:"",unfinishedTasks:0,
                                            finishedTasks:0});
    const [isFetching, setIsFetching] = useState(true);
    const [lists,setLists] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          if (currentUser) {
            try {
              const res = await getListsById(currentUser && currentUser._id);
              if (isMounted) {
                setLists(res);
                setIsFetching(false);
              }
            } catch (err) {
              console.log(err);
            }
          }
        };
      
        let isMounted = true;
        const debounceFunction = debounce(()=>fetchData(),2000);
        debounceFunction();
        return () => {
          isMounted = false;
        };
      }, [currentUser, lists]);
    return(
        <div className="lists">
            <div className="lists_titleContainer">
                <p className="lists_titleContainer_title">
                    {isCreating ? `Create a task list` : isEditing ? `Update a task list` :
                    lists && lists.length > 0 ? `You have ${lists.length} to-do lists!` : "You have no tasks"}
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
            {isCreating ? (
    <CreateTasks currentUser={currentUser} setIsCreating={setIsCreating} />
) : editData !== null && (isEditing ? (
    <EditTasks currentUser={currentUser} editData={editData} setIsEditing={setIsEditing} />
) : (
    <div className="lists_container">
        {isFetching ? (
            <PulseLoader
                color="#37d7b2"
                loading={isFetching}
                className="lists_container_emptyList"
            />
        ) : lists && lists.length > 0 ? (
            lists.map((list:any) => (
                <ListCard
                    key={list._id}
                    setIsEditing={setIsEditing}
                    setEditData={setEditData}
                    list={list}
                />
            ))
        ) : (
            <p className="lists_container_emptyList">
                Your list is empty. Click &quot;Create tasks&quot; to create a to-do list.
            </p>
        )}
    </div>
))}            </div>
        </div>
    )
}