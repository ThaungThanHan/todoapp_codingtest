"use client";
import "../styles/app.scss";
import React, {useState,useEffect} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {toast} from 'react-hot-toast';

export default function UserInfo({currentUser}){
    const router = useRouter();
    const handleLogoutUser = () => {
        const loadingToast = toast.loading("Logging out...");
        Cookies.set("authToken","");
        toast.dismiss(loadingToast);
        toast.success("You have logged out!",{
            duration:2000,
            icon:"🎉"
        });
        router.push(`/login`);
    }
    return(
        <div className="userInfo">
            <p className="userInfo_welcomeText">Hello, {currentUser && currentUser.username}</p>
            <p onClick={()=>handleLogoutUser()} className="userInfo_logout">Logout</p>
        </div>
    )
}