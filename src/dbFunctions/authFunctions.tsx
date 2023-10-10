"use server";
import {connect} from "@/dbConfig/dbConfig";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "@/models/userModel";
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
    
        const newUser = new UserModel({
            username,
            email,
            password:hashedPassword
        })
    
        const savedUser = await newUser.save();  
        return savedUser._id.toString();
    }catch(err:any){
        return {
            status: 'error',
            message: err.message,
        };
    }
}

export async function loginUser(data:any){
    try{
        const {email, password} = data;
        const user = await UserModel.findOne({email});
        if(!user){
            throw new Error("Invalid");
        }
        const validPassword = await bcryptjs.compare(password,user.password);
        if(!validPassword){
            throw new Error("Invalid")
        }

        if(!user.isVerified){
            throw new Error("Invalid.");
        }
    
        const tokenData = {
            id:user._id.toString(),
            username:user.username,
            email:user.email
        }

        const token = await jwt.sign(tokenData,process.env.TOKEN_SECRET,{expiresIn:"1d"});
        return token;
    }catch(err:any){
        return {
            status: 'error',
            message: err.message,
        };
    }
}

export async function getDataFromToken(token:any){
    try{
        const decodedToken:any = jwt.verify(token, process.env.TOKEN_SECRET!);
        return decodedToken.id;
    }catch(err:any){
        return {
            status: 'error',
            message: err.message,
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
            status: 'error',
            message: err.message,
        };
    }
}

export async function verifyUser(token:any){
    try{
        const user = await UserModel.findOne({verifyToken:token, verifyTokenExpiry:{$gt:Date.now()}});
        
        if(!user){
            throw new Error("Invalid");
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();
    }catch(err:any){
        return {
            status: 'error',
            message: err.message,
        };
    }
}

export async function forgotPassword(token:any,data:any){
    try{
        const user = await UserModel.findOne({forgotPasswordToken:token, forgotPasswordTokenExpiry:{$gt:Date.now()}});
        if(!user){
            throw new Error("Invalid");
        }
        const sameAsOld = await bcryptjs.compare(data.password,user.password);
        if(sameAsOld){
            throw new Error("Invalid")
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(data.password,salt); 

        user.password = hashedPassword;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();
    }catch(err:any){
        return {
            status: 'error',
            message: err.message,
        };
    }
}