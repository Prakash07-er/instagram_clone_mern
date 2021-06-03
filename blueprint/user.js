const mongoose = require('mongoose')
const {ObjectId} =mongoose.Schema.Types


const userShema = new mongoose.Schema({

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
    followers:[{
        type:ObjectId,
        ref: "User"
    }],
    following:[{
        type:ObjectId,
        ref: "User"
    }],
    pic:{
        type:String,
        default: "https://res.cloudinary.com/dj0pjewbs/image/upload/v1622694190/blank-profile-picture-973460_1280_ciyd1m.png"
    }
})
mongoose.model("User", userShema )