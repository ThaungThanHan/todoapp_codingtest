"use server";
import {connect} from "@/dbConfig/dbConfig";
import { revalidatePath } from "next/cache";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "@/models/UserModel";
import User from "@/models/UserModel";
import Cookies from "js-cookie";
connect();

export async function signupUser(data:any){
    try{
        const {username,email,password} = data; 
    
        const userWithEmail = await UserModel.findOne({email});
        if(userWithEmail){
            console.log("EXISTS")
            return "User already exists";
        }
    
        const userWithUsername = await UserModel.findOne({username});
        if(userWithUsername){
            console.log("EXISTS")
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
    }catch(err){
        console.log(err);
    }
}

export async function loginUser(data:any){
    try{
        const {email, password} = data;
        const user = await UserModel.findOne({email});
        if(!user){
            console.log("user does not exist");
        }
        const validPassword = await bcryptjs.compare(password,user.password);
        if(!validPassword){
            console.log("wrong password");
        }
    
        const tokenData = {
            id:user._id.toString(),
            username:user.username,
            email:user.email
        }

        const token = await jwt.sign(tokenData,process.env.TOKEN_SECRET,{expiresIn:"1d"});
        return token;
    }catch(err){
        console.log(err);
    }
}

export async function getDataFromToken(token:any){
    try{
        const decodedToken:any = jwt.verify(token, process.env.TOKEN_SECRET!);
        return decodedToken.id;
    }catch(err){
        console.log(err)
    }
}

export async function getLoggedUser(token:any){
    try{
        const loggedId = await getDataFromToken(token);
        if(loggedId == ""){
            console.log("User is not logged!");
        }
        const user = await UserModel.findOne({_id:loggedId});
        const result = {
            _id:user._id.toString(),
            username:user.username,
            email:user.username
        }
        console.log(result);
        return result;
    }catch(err){
        console.log(err);
    }
}