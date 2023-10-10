'use client';
import "../styles/auth.scss";
import { useForm, SubmitHandler } from "react-hook-form"
import { useRouter } from "next/navigation";
import ErrorText from "../components/auth/errorText";
import { loginUser } from "@/dbFunctions/authFunctions";
import {toast} from 'react-hot-toast';
import Cookies from 'js-cookie';
export default function Login() {
    const router = useRouter();
    type signinInput = {
        email:string
        password: string
      }
    const handleLogin = (data:any) => {
      const loadingToast = toast.loading('Logging in...');
      loginUser(data).then(res=>{
        Cookies.set('authToken',res,{expires:7});
        toast.dismiss(loadingToast);
        toast.success("Login successful!",{
            duration:2000,
            icon:"🎉"
        });
        router.push(`/`);
      }).catch(err=>{
        toast.dismiss(loadingToast);
        toast.error(err.message,{duration:2000});
      })}
    const { register, handleSubmit, formState: { errors } } = useForm<signinInput>();
    const onSubmit: SubmitHandler<signinInput> = (data) => handleLogin(data);
    return (
      <div className="auth_container">
          <div className="auth_form">
            <h2 className="auth_form_title">
                Login
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="auth_form_form">
                <div className="auth_form_input">
                    <label htmlFor="email" className="auth_form_input_label">Email</label>
                    <input id="email" {...register("email", { required: true})}
                    className="auth_form_input_inputbox" placeholder="Please enter email" />
                    {errors?.email?.type === "required" && <ErrorText text="Email is required!" />}
                </div>
                <div className="auth_form_input">
                    <label htmlFor="password" className="auth_form_input_label">Password</label>
                    <input id="password" {...register("password", { required: true})} 
                    type="password" className="auth_form_input_inputbox" 
                    placeholder="Please enter password" />
                    {errors?.password?.type === "required" && <ErrorText text="Password is required!" />}
                </div> 
                <a href="/confirmpasswordemail" className="auth_form_redirect_link">
                  Forgot password
                </a>
                <button className="auth_form_submit">
                    Log in
                </button>
            </form>
        <p className="auth_form_redirect">
            Don&apos;t have an account? <a href="/signup" className="auth_form_redirect_link">Join now!</a>
        </p>
          </div>
      </div>
    )
  }
  