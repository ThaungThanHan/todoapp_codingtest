"use client";
import "../styles/app.scss";
import React, {useState,useEffect} from "react";
export default function UserInfo({currentUser}){
    return(
        <div className="userInfo">
            <p className="userInfo_welcomeText">Hello,</p>
            <p className="userInfo_username">{currentUser && currentUser.username}</p>
        </div>
    )
}