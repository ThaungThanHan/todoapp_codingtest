"use client";
import "../styles/auth.scss";
import React, {useState,useEffect} from "react";
import { verifyUser } from "@/dbFunctions/authFunctions";
import {useRouter} from "next/navigation";
export default function Verify(){
    const router = useRouter();
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error,setError] = useState(false);

    const verifyEmail = async() => {
        const result = await verifyUser(token);
        if(result?.error){
            setError(true);
        }else{
            setVerified(true);
        }
    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);

    useEffect(() => {
        if(token.length > 0) {
            verifyEmail();
        }
    }, [token]);

    return(
        <div className="auth_container">
        <div className="auth_form">
          <h2 className="auth_form_title">
              {verified ? `You are Verified!` : `The verification is invalid.`}
              {verified ? <button onClick={()=> router.push("/login") } className="auth_form_submit">
                    Log in
              </button> : null}
          </h2>
        </div>
        </div>
    )
}