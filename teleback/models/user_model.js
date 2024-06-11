
// Model for User

const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types;

const userSchema=new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    UserName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    ProfilePicture:{
        type:String,
        default:"Not Provided"
    },
    Location:{
        type:String,
        default:"India"
    },
    DOB:{
        type:Date,
    },
    Followers:[
        {
            type: ObjectId,
            ref: "UserModel"
        }
    ],
    Following: [
        {
            type: ObjectId,
            ref: "UserModel"
        }
    ],
}, { timestamps:true})


mongoose.model("UserModel",userSchema)