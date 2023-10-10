'use client';
import "../styles/auth.scss";
import React, {useState,useEffect} from "react";
import { useForm, SubmitHandler } from "react-hook-form"
import { useRouter } from "next/navigation";
import ErrorText from "../components/auth/errorText";
import { forgotPassword } from "@/dbFunctions/authFunctions";
import {toast} from 'react-hot-toast';

export default function ConfirmPassword() {
    const [token, setToken] = useState("");
    const router = useRouter();
    type confirmPasswordInput = {
        password:string
        confirmpassword: string
    }
    useEffect(()=>{
      const urlToken = window.location.search.split("=")[1];
      setToken(urlToken || "");
    },[])
    const handleChangePassword = (data:any) => {
      const loadingToast = toast.loading('Changing password...');
      forgotPassword(token, data).then(res=>{
        toast.dismiss(loadingToast);
        toast.success("Password updated!",{
            duration:2000,
            icon:"🎉"
        });
        router.push(`/login`);
      }).catch(err=>{
        toast.dismiss(loadingToast);
        toast.error(err.message,{duration:2000});
      })}
    const { register, handleSubmit, watch, formState: { errors } } = useForm<confirmPasswordInput>();
    const onSubmit: SubmitHandler<confirmPasswordInput> = (data) => handleChangePassword(data);
    return (
      <div className="auth_container">
          <div className="auth_form">
            <h2 className="auth_form_title">
                New Password
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="auth_form_form">
                <div className="auth_form_input">
                    <label htmlFor="password" className="auth_form_input_label">Password</label>
                    <input id="password" {...register("password", { required: true, minLength: 8,maxLength:120 })}
                    type="password"
                    className="auth_form_input_inputbox" placeholder="Please enter new password" />
                    {errors?.password?.type === "required" && <ErrorText text="Password is required!" />}
                    {errors?.password?.type === "minLength" &&
                    <ErrorText text="Password must have minimum of 8 characters." />}
                    {errors?.password?.type === "maxLength" &&
                    <ErrorText text="Password must have maximum of 120 characters." />}
                </div>
                <div className="auth_form_input">
                    <label htmlFor="confirmpassword" className="auth_form_input_label">Confirm Password</label>
                    <input id="confirmpassword" {...register("confirmpassword", { required: true,
                    validate: (value:string) => {
                        if(watch("password") != value){
                            return "Password do not match"
                        }
                    }})} 
                    type="password" className="auth_form_input_inputbox" 
                    placeholder="Please enter password again" />
                    {errors?.confirmpassword?.type === "required" && 
                    <ErrorText text="Confirm Password is required!" />}
                    {errors?.confirmpassword?.type === "validate" && 
                    <ErrorText text="Passwords do not match!" />}
                </div> 
                <button className="auth_form_submit">
                    Enter
                </button>
            </form>
          </div>
      </div>
    )
  }
  