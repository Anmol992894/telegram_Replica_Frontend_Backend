// Importing functionalities

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const UserModel = mongoose.model('UserModel');
const TweetModel = mongoose.model('TweetModel');

const { JWT_SECRET } = require('../config');
const authentication = require('../middleware/authentication');


// API to create Tweet
router.post('/API/Createtweet', authentication, (req, res) => {
    const { Content } = req.body;

    TweetModel.find({ Content: Content })
        .then((data) => {
            if (!data) {
                res.status(400).json({ error: "Content Not Provided" })
            }
            const tweet = new TweetModel({ Content: Content, TweetedBy: req.user._id })
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



// API For Like
router.put('/API/tweet/:Tweetid/like/:userId', (req, res) => {
    const Tweetid = req.params.Tweetid;
    const UserId = req.params.userId;
    const updateUser = {
        Likes: UserId
    }

    TweetModel.findOne({ _id: Tweetid, Likes: UserId })
        .then((data) => {
            if (data) {
                return res.status(500).json({ result: "Already Liked" })
            }
            TweetModel.findByIdAndUpdate({ _id: Tweetid }, {
                $push: updateUser
            }, { new: true })
                .exec((error, result) => {
                    if (error) {
                        return res.status(400).json({ error: error });
                    } else {
                        return res.status(200).json({ success: "true" });
                    }
                })
        })
        .catch((error) => {
            console.log(error);
        })
})


// API for Unlike
router.put('/API/tweet/:Tweetid/unlike/:userId', (req, res) => {
    const Tweetid = req.params.Tweetid;
    const followingId = req.params.userId;
    const updateUser = {
        Likes: followingId
    }

    TweetModel.findOne({ _id: Tweetid, Likes: followingId })
        .then((data) => {
            if (!data) {
                return res.status(500).json({ result: "Already UnLiked" })
            }
            TweetModel.findByIdAndUpdate({ _id: Tweetid }, {
                $pull: updateUser
            }, { new: true })
                .exec((error, result) => {
                    if (error) {
                        return res.status(400).json({ error: error });
                    } else {
                        return res.status(200).json({ success: "true" });
                    }
                })
        })
        .catch((error) => {
            console.log(error);
        })
})

// API for reply
router.post('/API/tweet/:Tweetid/reply/:userid/:username', (req, res) => {

    const Content = req.body.Content;
    const Tweetid = req.params.Tweetid;
    const UserId = req.params.userid;

    TweetModel.find({ Content: Content })
        .then((data) => {
            if (!data) {
                res.status(400).json({ error: "Content Not Provided" })
            }
            const tweet = new TweetModel({ Content: Content, TweetedBy: UserId, UserName:req.params.username })
            tweet.save()
                .then((newTweet) => {
                    TweetModel.findByIdAndUpdate({ _id: Tweetid }, {
                        $push: { Replies: tweet._id }
                    }, { new: true })
                        .exec((error, result) => {
                            if (error) {
                                return res.status(404).json({ error: 'Parent tweet not found' })
                            }
                            else {
                                return res.status(200).json({ result: result });
                            }
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


// API to find One 
router.get('/API/tweet/:id',authentication, (req, res) => {
    const TweetId = req.params.id;

    try {
        TweetModel.findOne({ _id: TweetId })
        .populate("TweetedBy", "Name UserName Email ProfilePicture Location")
        .populate("Likes", "_id Name")
        .populate("RetweetedBy", "_id Name UserName")
        .populate("Replies", "_id Likes RetweetedBy Replies")
        .exec((error, result) => {
            if (error) {
                return res.status(404).json({ error: "Tweet Not Found" })
            }
            else {
                return res.status(200).json({ result: result })
            }
        })
        
    } catch (error) {
        console.error();
    }
    
})


// API to get all tweet
router.get('/API/tweets',authentication, (req, res) => {
    try {
        TweetModel.find()
            .populate("TweetedBy", "_id Name UserName Email ProfilePicture Location")
            .populate("Likes", "_id Name")
            .populate("RetweetedBy", "_id Name UserName")
            .populate("Replies", "_id Name UserName")
            .exec((error, result) => {
                if (error) {
                    return res.status(404).json({ error: "Tweet Not Found" })
                }
                else {
                    return res.status(200).json({ result: result })
                }
            })
    } catch (error) {
        console.error(error);
    }

})

// API to get particular user tweet
router.get('/API/usertweets/:userId',authentication, (req, res) => {
    try {
        TweetModel.find({TweetedBy:req.params.userId})
            .populate("TweetedBy", "Name UserName Email ProfilePicture Location")
            .populate("Likes", "_id Name")
            .populate("RetweetedBy", "_id Name UserName")
            .populate("Replies", "_id Name UserName")
            .exec((error, result) => {
                if (error) {
                    return res.status(404).json({ error: "Tweet Not Found" })
                }
                else {
                    return res.status(200).json({ result: result })
                }
            })
    } catch (error) {
        console.error(error);
    }

})

// API to delete tweet
router.delete("/API/deleteTweet/:id", authentication, (req, res) => {
    const TweetId=req.params.id
    TweetModel.findOne({ _id: TweetId})
        .exec((error, tweetFound) => {
            if (error || !tweetFound) {
                return res.status(400).json({ error: "Tweet does not exist" });
            }
            //check if the post author is same as loggedin user only then allow deletion
            if (tweetFound.TweetedBy._id.toString() === req.user._id.toString()) {
                tweetFound.remove()
                    .then((data) => {
                        res.status(200).json({ result: data });
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        })
});

// API for retweet
router.post('/API/tweet/:Tweetid/retweet/:userId',(req,res)=>{
    const TweetId=req.params.Tweetid;
    const UserId=req.params.userId;
    TweetModel.findOne({_id:TweetId,RetweetedBy:UserId})
    .then((result)=>{
        if(result){
            return res.status(400).json({error:"Tweet already exist"})
        }
        const update={
            RetweetedBy:UserId
        }
        TweetModel.findByIdAndUpdate({_id:TweetId},{
            $push:update
        },{new:true})
        .populate("RetweetedBy","_id UserName")
        .exec((error,result)=>{
            if(error){
                return res.status(404).json({error:"Tweet does not exist"})
            }
            return res.status(200).json({success:"true"})
        })
    })
    .catch((error)=>{
        console.log(error);
    })
})

module.exports = router;