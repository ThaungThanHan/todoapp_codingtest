"use server"

import nodemailer from "nodemailer";
import UserModel from "@/models/userModel";
import bcryptjs from "bcryptjs";

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
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await UserModel.findByIdAndUpdate(userId, 
                {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000})
        } else if (emailType === "RESET"){
            await UserModel.findByIdAndUpdate(userId, 
                {forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000})
        }

        const mailOptions = {
            from: 'hanvotingapp@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Hello from Todoapp-codingtest!<br/>Click <a href="${process.env.DOMAIN}/verify?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verify?token=${hashedToken}
            </p>`
        }
        const mailresponse = await transport.sendMail
        (mailOptions);
        return mailresponse;
    } catch (error:any) {
        throw new Error(error.message);
    }
}