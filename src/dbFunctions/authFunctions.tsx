"use server";
import {connect} from "@/dbConfig/dbConfig";
import { revalidatePath } from "next/cache";
import bcryptjs from "bcryptjs";
import UserModel from "@/models/UserModel";
import User from "@/models/UserModel";
connect();

export async function signupUser(data:any){
    const {username,email,password} = data; 
    
    const user = await UserModel.findOne({email});
    if(user){
        return "User already exists";
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password,salt); 

    const newUser = new User({
        username,
        email,
        password:hashedPassword
    })

    const savedUser = await newUser.save();
    console.log(savedUser);
}