"use server";
import {connect} from "@/dbConfig/dbConfig";
import TaskListsModel from '@/models/taskListModel';
import { revalidatePath } from "next/cache";
connect();

export async function addListToDB(data:any){
    try{
        const existingList = await TaskListsModel.find({userId:data.userId,listName:data.listName});
        if(existingList.length > 0){
            throw new Error("Task list with same name exists")
        }
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
    }catch(err:any){
        return {
            status: 'error',
            message: err.message,
        };
    }
}

export async function getListsById(userId:any){
    try{
        const lists = await TaskListsModel.find({userId:userId});
        const response:any = [];
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
    }catch(err:any){
        return {
            status: 'error',
            message: err.message,
        };
    }
}

export async function updateList(listId:any, data:any){
    try{
        const existingList = await TaskListsModel.findOne({ userId:data.userId, 
        _id: { $ne: data.listId }, listName: data.listName });
        if(existingList){
            throw new Error("Task list with same name exists")
        }
        const unfinishedTasks = data.tasks.filter((task:any)=> task.status == "unfinished").length; 
        const finishedTasks = data.tasks.filter((task:any)=> task.status == "finished").length; 
        const updateList = await TaskListsModel.findByIdAndUpdate(listId,{
            listName:data.listName,
            tasks:data.tasks,
            unfinishedTasks:unfinishedTasks,
            finishedTasks:finishedTasks
        })
    }catch(err:any){
        return {
            status: 'error',
            message: err.message,
        };
    }
}

export async function deleteList(listId:any){
    try{
        const deleteList = await TaskListsModel.findByIdAndDelete(listId);
    }catch(err:any){
        return {
            status: 'error',
            message: err.message,
        };
    }
}

