"use server"

import nodemailer from "nodemailer";
import UserModel from "@/models/userModel";
import bcryptjs from "bcryptjs";
import {connect} from "@/dbConfig/dbConfig";
connect();

let transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port : 465,
    auth: {
      user: "hanvotingapp@gmail.com", // generated ethereal user
      pass: "bixgqgxvahaltfzx", // generated ethereal password
    },
  });

export async function sendEmail({email,emailType,userId}:any){
    try{
        if(emailType == "VERIFY"){
            var hashedToken = await bcryptjs.hash(userId.toString(), 10);
            await UserModel.findByIdAndUpdate(userId, 
                {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000})
        }else if(emailType == "FORGOT"){
            var userByEmail = await UserModel.findOne({email});
            if(!userByEmail){
                throw new Error("Invalid.");
            }
            var hashedEmailToken = await bcryptjs.hash(userByEmail._id.toString(),10);
            await UserModel.findByIdAndUpdate(userByEmail._id, 
                {forgotPasswordToken: hashedEmailToken, forgotPasswordTokenExpiry: Date.now() + 3600000})
        }


        const mailOptions = {
            from: 'hanvotingapp@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Hello from Todoapp-codingtest!<br/>Click <a href="${process.env.DOMAIN}/${emailType == "VERIFY" ? "verify" : "confirmpassword"}?token=${emailType == "VERIFY" ? hashedToken :
            hashedEmailToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/${emailType == "VERIFY" ? "verify" : "confirmpassword"}?token=${emailType === "VERIFY" ? hashedToken :
            hashedEmailToken}
            </p>`
        }
        const mailresponse = await transport.sendMail
        (mailOptions);
        return mailresponse;
    } catch (error:any) {
        throw error;
    }
}