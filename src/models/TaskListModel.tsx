import mongoose from "mongoose";

const taskListSchema = new mongoose.Schema({
    listName:{type:String, required:[true, "Please provide name for task list"]},
    tasks:{type:Array,required:[true,"Please provide tasks for task list"]},
    userId:{type:String,required:[true]},
    unfinishedTasks:{type:Number,required:[true]},
    finishedTasks:{type:Number,required:[true]}
},{collection:"taskLists"})

const taskLists = mongoose.models.taskLists || mongoose.model("taskLists", taskListSchema);

export default taskLists;