"use server";
import TaskListsModel from "@/models/TaskListModel";
import {connect} from "@/dbConfig/dbConfig";
import { revalidatePath } from "next/cache";
connect();

export async function addListToDB(data:any){
    try{
        const listData = new TaskListsModel({
            listName:data.listName,
            tasks:data.tasks,
            unfinishedTasks:data.tasks.length,
            finishedTasks:0
        })
        await listData.save();
        revalidatePath("http://localhost:3000/");
    }catch(err){
        console.error(err)
    }
}

export async function getLists(){
    try{
        const lists = await TaskListsModel.find();
        const response = [];
        lists.map(list=>{
            response.push({
                _id:list._id.toString(),
                listName:list.listName,
                tasks:list.tasks
            })
        })
        return response;
    }catch(error){
        console.error(error)
    }
}

export async function deleteList(listId:any){
    try{
        const deleteList = await TaskListsModel.findByIdAndDelete(listId);
        revalidatePath("http://localhost:3000/");
    }catch(err){
        console.error(err);
    }
}