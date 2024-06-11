// importing modules
// This is a file route

const express=require('express');
const router=express.Router();
const multer=require('multer');
const mongoose = require('mongoose');
const authentication = require('../middleware/authentication');
const UserModel = mongoose.model('UserModel');
const TweetModel = mongoose.model('TweetModel');
const cloudinary=require('../helper/cloudinaryconfig')


// Image Configuration
const imgconfig=multer.diskStorage({
    destination: function(req, file, cb){
        return cb(null, "./uploads")
    },
    filename: function (req, file, cb){
        return cb(null, `image-${Date.now()}_${file.originalname}`)
    }
})

// filtering 
const isImage= (req,file,callback)=>{
    if(file.mimetype.startsWith("image")){
        callback(null,true)
    }else{
         callback(new Error("only image is allowed"))
    }
}

// Upload configuration
const upload=multer({
    storage:imgconfig,
    fileFilter:isImage
})

// API to Upload File

router.post('/API/uploadProfile/:userId',upload.single('photo'), async(req,res)=>{
    const upload=await cloudinary.uploader.upload(req.file.path)
    console.log(upload);
    // console.log(req.file.fieldname);
    const userid=req.params.userId;
    console.log(userid);
    UserModel.findByIdAndUpdate({_id:userid},{
        $set:{ProfilePicture:upload.secure_url}
    },{new:true})
    .exec((error, result) => {
        if (error) {
            return res.status(400).json({ error: error });
        } else {
            return res.status(200).json({ success: result });
        }
    })
})

// Upload image for tweet

router.post('/API/uploadtweet/:userId',upload.single('photo'), async(req,res)=>{
    const upload=await cloudinary.uploader.upload(req.file.path)
    console.log(upload);
    const {Content}=req.body;
    // console.log(req.file.fieldname);
    const userid=req.params.userId;
    console.log(userid);
    TweetModel.find({ Content: Content })
        .then((data) => {
            if (!data) {
                res.status(400).json({ error: "Content Not Provided" })
            }
            const tweet = new TweetModel({ Content: Content, TweetedBy: userid, Image:upload.secure_url })
            tweet.save()
                .then((newTweet) => {
                    res.status(200).json({ result: newTweet });
                })
                .catch((error) => {
                    console.log(error);
                })
        })
        .catch((error) => {
            console.log(error);
        })
})


module.exports = router;