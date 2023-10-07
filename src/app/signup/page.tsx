'use client';
import "../styles/auth.scss";
import { useForm, SubmitHandler } from "react-hook-form"
import ErrorText from "../components/auth/ErrorText";
import { signupUser } from "@/dbFunctions/authFunctions";
export default function Signup() {
    interface signupInput {
        username: string
        email:string
        password: string
        confirmpassword:string
      }
    const { register, handleSubmit,watch, formState: { errors } } = useForm();
    const onSubmit: SubmitHandler<signupInput> = (data) => signupUser(data);
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
    return (
      <div className="auth_container">
          <div className="auth_form">
            <h2>
                Sign up
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="auth_form_form">
                <div className="auth_form_input">
                    <label className="auth_form_input_label">Username</label>
                    <input {...register("username", { required: true, maxLength: 20 })}
                    className="auth_form_input_inputbox" placeholder="Please enter username" />
                    {errors?.username?.type === "required" && <ErrorText text="Username is required!" />}
                    {errors?.username?.type === "maxLength" &&
                    <ErrorText text="Username must not be over 20 characters long!" />}
                </div>
                <div className="auth_form_input">
                    <label className="auth_form_input_label">Email</label>
                    <input {...register("email", { required: true, pattern:emailRegex })}
                    className="auth_form_input_inputbox" placeholder="Please enter email" />
                    {errors?.email?.type === "required" && <ErrorText text="Email is required!" />}
                    {errors?.email?.type === "pattern" &&
                    <ErrorText text="Please enter valid email address" />}
                </div>
                <div className="auth_form_input">
                    <label className="auth_form_input_label">Password</label>
                    <input {...register("password", { required: true, minLength: 8,maxLength:120 })} 
                    type="password" className="auth_form_input_inputbox" 
                    placeholder="Please enter password" />
                    {errors?.password?.type === "required" && <ErrorText text="Password is required!" />}
                    {errors?.password?.type === "minLength" &&
                    <ErrorText text="Password must have minimum of 8 characters." />}
                    {errors?.password?.type === "maxLength" &&
                    <ErrorText text="Password must have maximum of 120 characters." />}
                </div> 
                <div className="auth_form_input">
                    <label className="auth_form_input_label">Confirm Password</label>
                    <input {...register("confirmPassword", { required: true,
                    validate: (value:string) => {
                        if(watch("password") != value){
                            return "Password do not match"
                        }
                    } })} 
                     type="password" className="auth_form_input_inputbox" 
                    placeholder="Please enter password again" />
                    {errors?.confirmPassword?.type === "required" && 
                    <ErrorText text="Confirm Password is required!" />}
                    {errors?.confirmPassword?.type === "validate" && 
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
  