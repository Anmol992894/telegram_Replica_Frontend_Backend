
// Model for tweet 

const mongoose=require('mongoose');
const {ObjectId}= mongoose.Schema.Types;

const tweetSchema=new mongoose.Schema({
    Content:{
        type:String,
        required:true
    },
    UserName:{
        type:String,
        ref:"UserModel"
    },
    TweetedBy:{
        type:ObjectId,
        ref:"UserModel"
    },
    Likes:[
        {
            type:ObjectId,
            ref:"UserModel"
        }
    ],
    RetweetedBy:[
        {
            type:ObjectId,
            ref:"UserModel"
        }
    ],
    Image:{
        type:String,
        default:"None"
    },
    Replies:[
        {
            type:ObjectId,
            ref:'TweetModel'
        }
    ],
    
},{timestamps:true})


mongoose.model("TweetModel",tweetSchema);