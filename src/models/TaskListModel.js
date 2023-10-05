import mongoose from "mongoose";

const taskListSchema = new mongoose.Schema({
    listName:{type:String, required:[true, "Please provide name for task list"], unique:true},
    tasks:{type:Array,required:[true,"Please provide tasks for task list"]}
},{collection:"taskLists"})

const taskLists = mongoose.models.taskLists || mongoose.model("taskLists", taskListSchema);

export default taskLists;