const express = require('express')
const router = express.Router()
const mongoose = require ('mongoose')
const requirelogin = require('../middleware/requirelogin')
const Post = mongoose.model("Post")
const User = mongoose.model("User")


router.get('/user/:id',requirelogin, (req,res) => {
    
    // find the user details who has logged in 
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user => {

        // find the details of user who created the post
        Post.find({postedBy: req.params.id})
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
            if(err) {
                return res.status(422).json({error:err})
            }
            else {
                 res.status(200).json({user, posts})
            }   
        })
    })
    .catch(error => {
        return res.status(404).json({error: "User not found"})
    })
})

router.put('/follow',requirelogin, (req,res) => {
    User.findByIdAndUpdate(req.body.followId , { // find the id of following user
        $push : {followers:req.user._id} // id of the logged in user

    },
    {
        new:true
    },(err, result) => {
        if(err) {
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id , {
            $push : {following :req.body.followId}
        },{
            new: true
        }).select("-password")
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => [
            res.status(422).json({error:err})
        ])
    })

})

router.put('/unfollow',requirelogin, (req,res) => {
    User.findByIdAndUpdate(req.body.unfollowId , { // find the id of following user
        $pull : {followers:req.user._id} // id of the logged in user

    },
    {
        new:true
    },(err, result) => {
        if(err) {
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id , {
            $pull : {following :req.body.unfollowId}
        },{
            new: true
        }).select("-password")
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => [
            res.status(422).json({error:err})
        ])
    })

})

router.put('/updatepic' ,requirelogin, (req,res) => {
    User.findByIdAndUpdate(req.user._id, {$set:{pic:req.body.pic}},
        {
            new:true
        },
        (err, result) => {
            if(err){
                return res.status(422).json({error:"unable to update picture"})
            }
            res.json(result)
        })
})

module.exports = router















