"use client";
import React, {useState,useEffect} from "react";
import { getLoggedUser } from "@/dbFunctions/authFunctions";
import Cookies from "js-cookie";
import "./styles/app.scss";
import UserInfo from "./components/userInfo";
import ToDoLists from "./components/toDoLists";
export default function Home() {
  const [currentUser,setCurrentUser] = useState(null);

  useEffect(()=>{
      const token = Cookies.get('authToken');
      getLoggedUser(token).then(res=>{
          setCurrentUser(res);
      }).catch(err=>{
          console.log(err);
      })
  },[currentUser])
  return (
    <div className="container">
      <div className="app_container">

        <UserInfo currentUser={currentUser}/>
        <ToDoLists currentUser={currentUser}/>
      </div>
    </div>
  )
}
