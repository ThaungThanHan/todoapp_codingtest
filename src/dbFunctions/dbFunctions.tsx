"use server";
import {connect} from "@/dbConfig/dbConfig";
import { revalidatePath } from "next/cache";
import TaskListsModel from '@/models/TaskListModel';

connect();

export async function addListToDB(data:any){
    try{
        console.log(data);
        const unfinishedTasks = data.tasks.length;
        const finishedTasks = 0;
        const listData = new TaskListsModel({
            listName:data.listName,
            tasks:data.tasks,
            userId:data.userId,
            unfinishedTasks:unfinishedTasks,
            finishedTasks:finishedTasks
        })
        await listData.save();
        revalidatePath("http://localhost:3000/");
    }catch(err){
        console.error(err)
    }
}

export async function getListsById(userId:any){
    try{
        const lists = await TaskListsModel.find({userId:userId});
        const response = [];
        lists.map(list=>{
            response.push({
                _id:list._id.toString(),
                listName:list.listName,
                tasks:list.tasks,
                unfinishedTasks:list.unfinishedTasks,
                finishedTasks:list.finishedTasks
            })
        })
        return response;
    }catch(error){
        console.error(error)
    }
}

export async function getListById(listId:any){
    try{
        const list = await TaskListsModel.findById(listId);
        const result = {
            _id:list._id.toString(),
            listName:list.listName,
            tasks:list.tasks,
            unfinishedTasks:list.unfinishedTasks,
            finishedTasks:list.finishedTasks,
        }
        return result;
    }catch(err){
        console.error(err);
    }

}

export async function updateList(listId:any, data:any){
    try{
        const unfinishedTasks = data.tasks.filter((task)=> task.status == "unfinished").length; 
        const finishedTasks = data.tasks.filter((task)=> task.status == "finished").length; 
        const updateList = await TaskListsModel.findByIdAndUpdate(listId,{
            listName:data.listName,
            tasks:data.tasks,
            unfinishedTasks:unfinishedTasks,
            finishedTasks:finishedTasks
        })
        updateList.save();
        revalidatePath("http://localhost:3000/");
    }catch(err){
        console.error(err)
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

