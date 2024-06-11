// Importing functionalities

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const UserModel = mongoose.model('UserModel');
const TweetModel = mongoose.model('TweetModel');
const multer=require('multer');

const { JWT_SECRET } = require('../config');

const authentication = require('../middleware/authentication')


// API to register user
router.post('/API/auth/register', (req, res) => {
    const { Name, Email, UserName, Password } = req.body;

    if (!Name || !Email || !UserName || !Password) {
        return res.status(404).json({ error: "One or more mandatory Field is missing" })
    }
    UserModel.findOne({ Email: Email })
        .then((EmailinDB) => {
            if (EmailinDB) {
                res.status(500).json({ error: "User with the email already exist" })
            }
            UserModel.findOne({ UserName: UserName })
                .then((UsernameinDB) => {
                    if (UsernameinDB) {
                        res.status(500).json({ error: "Username already taken" })
                    }
                    bcrypt.hash(Password, 16)
                        .then((hashedPassword) => {
                            const user = new UserModel({ Name, Email, UserName, Password: hashedPassword})
                            user.save()
                                .then((newUser) => {
                                    res.status(200).json({ result: "User registered Successfully" })
                                })
                                .catch((error) => {
                                    console.log(error);
                                })
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                })
                .catch((error) => {
                    console.log(error);
                })
        })
})

// API for Login
router.post('/API/auth/login', (req, res) => {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
        res.status(400).json({ error: "One or more mandatory field is required" });
    }
    UserModel.findOne({ Email: Email })
        .then((userinDB) => {
            if (!userinDB) {
                res.status(401).json({ error: "User not Registered" })
            }
            bcrypt.compare(Password, userinDB.Password)
                .then((didMatch) => {
                    if (didMatch) {
                        const jwttoken = jwt.sign({ _id: userinDB._id }, JWT_SECRET)
                        const userinfo = { "_id": userinDB._id, "Email": userinDB.Email, "Name": userinDB.Name, "UserName":userinDB.UserName }
                        return res.status(200).json({ result: { "Token": jwttoken, "UserInfo": userinfo } })
                    }
                    else {
                        return res.status(401).json({ error: "Inncorrect Password" })
                    }
                })
                .catch((error) => {
                    return res.status(401).json({ error: "Inncorrect Password"+error })
                })
        })
        .catch((error) => {
            console.log(error);
        })
})


// API to find one user
router.get('/API/user/:Userid', (req, res) => {

    UserModel.findOne({ _id: req.params.Userid })
        .populate('Following')
        .populate('Followers')
        .exec((error, userfound) => {
            if (error || !userfound) {
                return res.status(401).json({ error: "User not Found" })
            }
            return res.status(200).json({ result: userfound })

        })
})

// API to follow user
router.put('/API/user/:followingId/follow/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const followingId = req.params.followingId;


        // Check if user is already following
        const isFollowing = await UserModel.exists({ _id: userId, Following: followingId });
        if (isFollowing) {
            return res.status(400).json({ success: false});
        }

        // Update user's following
        const updateUser = await UserModel.findByIdAndUpdate(userId, { $push: { Following: followingId } }, { new: true });
        if (!updateUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update following user's followers
        const updateFollowing = await UserModel.findByIdAndUpdate(followingId, { $push: { Followers: userId } }, { new: true });
        if (!updateFollowing) {
            // Roll back the previous update if following user not found
            await UserModel.findByIdAndUpdate(userId, { $pull: { Following: followingId } });
            return res.status(404).json({ error: "Following user not found" });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// API to unfollow user
router.put('/API/user/:followingId/unfollow/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const followingId = req.params.followingId;

        // Validate ObjectId format for userId and followingId

        // Check if user is already following
        const isFollowing = await UserModel.exists({ _id: userId, Following: followingId });
        if (!isFollowing) {
            return res.status(400).json({ success:false});
        }

        // Update user's following
        const updateUser = await UserModel.findByIdAndUpdate(userId, { $pull: { Following: followingId } }, { new: true });
        if (!updateUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update following user's followers
        const updateFollowing = await UserModel.findByIdAndUpdate(followingId, { $pull: { Followers: userId } }, { new: true });
        if (!updateFollowing) {
            // Roll back the previous update if following user not found
            await UserModel.findByIdAndUpdate(userId, { $push: { Following: followingId } });
            return res.status(404).json({ error: "Following user not found" });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// API to Edit user
router.put('/API/userEdit/:id',authentication, (req, res) => {
    const update = {
        Name: req.body.Name,
        Location: req.body.Location,
        DOB: req.body.DOB
    };
    UserModel.findByIdAndUpdate({ _id: req.params.id }, {
        $set: update
    },{new:true})
    .exec((error,result)=>{
        if(error){
            res.status(401).json({error:error})
        }
        else{
            res.status(200).json({success:result})
        }
    })
})

// API to get user tweet
router.get('/API/user/:id/tweets',(req,res)=>{
    TweetModel.find({TweetedBy:req.params.id})
    .then((data)=>{
        if(!data){
            res.status(401).json({error:"Not Posted and Tweet Yet"})
        }
        res.status(200).json({result:data})
    })
    .catch((error)=>{
        console.log(error);
    })
})

module.exports = router;