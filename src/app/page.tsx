"use client";
import React, {useState,useEffect} from "react";
import { startTransition } from "react";
import { getLoggedUser } from "@/dbFunctions/authFunctions";
import Cookies from "js-cookie";
import "./styles/app.scss";
import ToDoLists from "@/app/components/toDoLists";
import UserInfo from "@/app/components/userInfo";
export default function Home() {
  type CurrentUser ={
        _id:string,
        username:string
    }
  const [currentUser,setCurrentUser] = useState<CurrentUser>({
    _id:"",
    username:""
  });

  useEffect(()=>{
      const token = Cookies.get('authToken');
      getLoggedUser(token).then((res:any)=>{
          setCurrentUser(res);
      }).catch(err=>{
          console.log(err);
      })
  },[])
  return (
    <div className="container">
      <div className="app_container">
        <UserInfo currentUser={currentUser}/>
        <ToDoLists currentUser={currentUser}/>
      </div>
    </div>
  )
}
