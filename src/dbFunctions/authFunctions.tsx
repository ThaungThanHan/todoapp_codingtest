"use server";
import {connect} from "@/dbConfig/dbConfig";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "@/models/userModel";
import User from "@/models/userModel";

connect();

export async function signupUser(data:any){
    try{
        const {username,email,password} = data; 
    
        const userWithEmail = await UserModel.findOne({email});
        if(userWithEmail){
            throw new Error("User already exists.");
        }
    
        const userWithUsername = await UserModel.findOne({username});
        if(userWithUsername){
            throw new Error("User already exists.");
        }
    
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password,salt); 
    
        const newUser = new User({
            username,
            email,
            password:hashedPassword
        })
    
        const savedUser = await newUser.save();  
    }catch(err){
        throw err;
    }
}

export async function loginUser(data:any){
    try{
        const {email, password} = data;
        const user = await UserModel.findOne({email});
        if(!user){
            throw new Error("Invalid email or password.");
        }
        const validPassword = await bcryptjs.compare(password,user.password);
        if(!validPassword){
            throw new Error("Invalid email or password.")
        }
    
        const tokenData = {
            id:user._id.toString(),
            username:user.username,
            email:user.email
        }

        const token = await jwt.sign(tokenData,process.env.TOKEN_SECRET,{expiresIn:"1d"});
        return token;
    }catch(err){
        throw err;
    }
}

export async function getDataFromToken(token:any){
    try{
        const decodedToken:any = jwt.verify(token, process.env.TOKEN_SECRET!);
        return decodedToken.id;
    }catch(err){
        throw err;
    }
}

export async function getLoggedUser(token:any){
    try{
        const loggedId = await getDataFromToken(token);
        const user = await UserModel.findOne({_id:loggedId});
        const result = {
            _id:user._id.toString(),
            username:user.username,
            email:user.username
        }
        return result;
    }catch(err){
        throw err;
    }
}