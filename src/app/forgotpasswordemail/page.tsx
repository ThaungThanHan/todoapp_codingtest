'use client';
import "../styles/auth.scss";
import { useForm, SubmitHandler } from "react-hook-form"
import { useRouter } from "next/navigation";
import ErrorText from "../components/auth/errorText";
import {toast} from 'react-hot-toast';
import { sendEmail } from "@/dbFunctions/mailer";

export default function ForgotPasswordEmail() {
    const router = useRouter();
    type emailInput = {
        email:string
      }
    const handleChangePasswordEmail = async(data:any) => {
      const loadingToast = toast.loading('Sending mail...');
      const result = await sendEmail({email:data.email,emailType:"FORGOT",userId:null});
      if(result?.error){
        toast.dismiss(loadingToast);
        toast.error(result.error)
      }else{
        toast.dismiss(loadingToast);
        toast.success("Verification link sent to mail!",{
            duration:2000,
            icon:"🎉"
        });
        router.push(`/login`);
      }
}
    const { register, handleSubmit, formState: { errors } } = useForm<emailInput>();
    const onSubmit: SubmitHandler<emailInput> = (data) => handleChangePasswordEmail(data);
    const emailRegex =/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    return (
      <div className="auth_container">
          <div className="auth_form">
            <h2 className="auth_form_title">
                Enter your email
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="auth_form_form">
                <div className="auth_form_input">
                    <input id="email" {...register("email", { required: true, pattern:emailRegex })}
                    className="auth_form_input_inputbox" placeholder="Please enter email" />
                    {errors?.email?.type === "required" && <ErrorText text="Email is required!" />}
                    {errors?.email?.type === "pattern" &&
                    <ErrorText text="Please enter valid email address" />}
                </div>
                <button className="auth_form_submit">
                    Enter
                </button>
            </form>
          </div>
      </div>
    )
  }
  