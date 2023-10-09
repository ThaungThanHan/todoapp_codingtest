'use client';
import "../styles/auth.scss";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler  } from "react-hook-form"
import ErrorText from "../components/auth/errorText";
import { signupUser } from "@/dbFunctions/authFunctions";
import {toast} from 'react-hot-toast';

export default function Signup() {
    const router = useRouter();

    type signupInput = {
        username: string
        email:string
        password: string
        confirmpassword:string
      }


    const { register, handleSubmit,watch, formState: { errors } } = useForm<signupInput>();
    const handleSignUp = (data:any) => {
        const loadingToast = toast.loading("Signing up...");
        signupUser(data).then((res:any)=>{
            toast.dismiss(loadingToast);
            toast.success("Signup successful!",{
                duration:2000,
                icon:"🎉"
            });
            router.push(`/login`);
        }).catch(err=>{
            toast.dismiss(loadingToast);
            toast.error(err.message,{duration:2000});
          })
    }
    const onSubmit: SubmitHandler<signupInput> = (data) => handleSignUp(data);
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
    return (
      <div className="auth_container">
          <div className="auth_form">
            <h2 className="auth_form_title">
                Sign up
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="auth_form_form">
                <div className="auth_form_input">
                    <label htmlFor="username" className="auth_form_input_label">Username</label>
                    <input id="username" {...register("username", { required: true, maxLength: 20 })}
                    className="auth_form_input_inputbox" placeholder="Please enter username" />
                    {errors?.username?.type === "required" && <ErrorText text="Username is required!" />}
                    {errors?.username?.type === "maxLength" &&
                    <ErrorText text="Username must not be over 20 characters long!" />}
                </div>
                <div className="auth_form_input">
                    <label htmlFor="email" className="auth_form_input_label">Email</label>
                    <input id="email" {...register("email", { required: true, pattern:emailRegex })}
                    className="auth_form_input_inputbox" placeholder="Please enter email" />
                    {errors?.email?.type === "required" && <ErrorText text="Email is required!" />}
                    {errors?.email?.type === "pattern" &&
                    <ErrorText text="Please enter valid email address" />}
                </div>
                <div className="auth_form_input">
                    <label htmlFor="password" className="auth_form_input_label">Password</label>
                    <input id="password" {...register("password", { required: true, minLength: 8,maxLength:120 })} 
                    type="password" className="auth_form_input_inputbox" 
                    placeholder="Please enter password" />
                    {errors?.password?.type === "required" && <ErrorText text="Password is required!" />}
                    {errors?.password?.type === "minLength" &&
                    <ErrorText text="Password must have minimum of 8 characters." />}
                    {errors?.password?.type === "maxLength" &&
                    <ErrorText text="Password must have maximum of 120 characters." />}
                </div> 
                <div className="auth_form_input">
                    <label htmlFor="confirmPass" className="auth_form_input_label">Confirm Password</label>
                    <input id="confirmPass" {...register("confirmpassword", { required: true,
                    validate: (value:string) => {
                        if(watch("password") != value){
                            return "Password do not match"
                        }
                    } })} 
                     type="password" className="auth_form_input_inputbox" 
                    placeholder="Please enter password again" />
                    {errors?.confirmpassword?.type === "required" && 
                    <ErrorText text="Confirm Password is required!" />}
                    {errors?.confirmpassword?.type === "validate" && 
                    <ErrorText text="Passwords do not match!" />}

                </div> 
                <button className="auth_form_submit">
                    Sign up
                </button>
            </form>
        <p className="auth_form_redirect">
            Already have an account? <a href="/login" className="auth_form_redirect_link">Login now!</a>
        </p>
          </div>
      </div>
    )
  }
  