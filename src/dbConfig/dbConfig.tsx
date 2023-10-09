import mongoose from "mongoose";

export async function connect(){
    try{
        mongoose.connect(`${process.env.MONGO_URI}`,{
            dbName:"todoapp_codingtest"
        });
        const connection = mongoose.connection;
        connection.on("error",(err)=>{
            console.log(err)
            process.exit();
        })
    }
    catch(err){
        console.log(err)
    }
}