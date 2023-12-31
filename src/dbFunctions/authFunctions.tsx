"use server";
import {connect} from "@/dbConfig/dbConfig";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "@/models/userModel";
connect();

export async function signupUser(data:any){
    try{
        const {username,email,password} = data; 
    
        const userWithEmail = await UserModel.findOne({email:email.toLowerCase()});
        if(userWithEmail){
            throw new Error("User already exists.");
        }
    
        const userWithUsername = await UserModel.findOne({username});
        if(userWithUsername){
            throw new Error("User already exists.");
        }
    
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password,salt); 
    
        const newUser = new UserModel({
            email:email.toLowerCase(),
            username:username,
            password:hashedPassword
        })
    
        const savedUser = await newUser.save();  
        return savedUser._id.toString();
    }catch(err:any){
        return {
            error:err.message
        };
    }
}

export async function loginUser(data:any){
    try{
        const {email, password} = data;
        const user = await UserModel.findOne({email:email.toLowerCase()});
        if(!user){
            throw new Error("Invalid email or password");
        }
        const validPassword = await bcryptjs.compare(password,user.password);
        if(!validPassword){
            throw new Error("Invalid email or password")
        }

        if(!user.isVerified){
            throw new Error("Please verify first.");
        }
    
        const tokenData = {
            id:user._id.toString(),
            username:user.username,
            email:user.email.toLowerCase()
        }

        const token = await jwt.sign(tokenData,process.env.TOKEN_SECRET,{expiresIn:"1d"});
        return token;
    }catch(err:any){
        return {
            error:err.message
        };
    }
}

export async function getDataFromToken(token:any){
    try{
        const decodedToken:any = jwt.verify(token, process.env.TOKEN_SECRET!);
        return decodedToken.id;
    }catch(err:any){
        return {
            error:err.message
        };
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
    }catch(err:any){
        return {
            error:err.message
        };
    }
}

export async function verifyUser(token:any){
    try{
        const user = await UserModel.findOne({verifyToken:token, verifyTokenExpiry:{$gt:Date.now()}});
        
        if(!user){
            throw new Error("Invalid link");
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();
    }catch(err:any){
        return {
            error:err.message
        };
    }
}

export async function forgotPassword(token:any,data:any){
    try{
        const user = await UserModel.findOne({forgotPasswordToken:token, forgotPasswordTokenExpiry:{$gt:Date.now()}});
        if(!user){
            throw new Error("Invalid link");
        }
        const sameAsOld = await bcryptjs.compare(data.password,user.password);
        if(sameAsOld){
            throw new Error("Please choose new password")
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(data.password,salt); 

        user.password = hashedPassword;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();
    }catch(err:any){
        return {
            error:err.message
        };
    }
}