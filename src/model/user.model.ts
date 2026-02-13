import mongoose,{ Schema, Model, Document } from "mongoose";

 interface user extends Document{
    name:string,
    email:string
    password:string
    refreshToken : string
}

const userSchema : Schema<user>  = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    refreshToken: String
},{timestamps:true})


const user: Model<user> = mongoose.models.user || mongoose.model("user", userSchema)

export default user