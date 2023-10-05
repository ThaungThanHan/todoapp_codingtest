"use server";
import TaskListsModel from "@/models/TaskListModel";
import {connect} from "@/dbConfig/dbConfig";
connect();

export async function addListToDB(data:any){
    try{
        console.log(data.listName);
        const listData = new TaskListsModel({
            listName:data.listName,
            tasks:data.tasks
        })
        await listData.save();
        console.log("CREATED!");
    }catch(err){
        console.error(err)
    }
}