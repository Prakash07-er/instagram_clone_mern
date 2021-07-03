const express = require('express')
const router = express.Router()
const mongoose = require ('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require ('jsonwebtoken')
const { JWT_SECRET } = require ('../config/keys')
const requirelogin =  require("../middleware/requirelogin")
const nodemailer = require('nodemailer')
const sendgridTranport = require('nodemailer-sendgrid-transport')


let transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: "er.u.prakashmahi@gmail.com",
        pass: "123456"
    }
})

router.get('/protected', requirelogin , (req,res) => {
    res.send(" Welcome to Encrypted page ")
})

router.post('/signup',(req,res) => {
    const {email,name, password, pic} = req.body
    if(!email || !name || !password) {
      return  res.status(422).json({error: "Name, email and passwords are required field"})
    }
    User.findOne({email:email}) 
    .then ((savedUser) => {
        if(savedUser){
          return  res.status(422).json({error: "User already exist with this email"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword => {
            const user = new User({
                name,
                email,
                password:hashedpassword,
                pic
               })
               user.save()
               .then(user => {
                   transporter.sendMail({
                       to: user.email,
                       from: "no-reply@bloggersden.com",
                       subject: "Welcome To Bloggers Den",
                        html: "<h1> Thank you for sining up with us... Be a king in Den!!!!</h1>"
                   })
                   res.json({message:"Signed Up Successfully"})
               })
               .catch(err => {
                   console.log(err)
               })
        })
    })
    .catch(err => {
        console.log(err)
    })
})

router.post('/signin', (req,res) => {
    const {email, password} = req.body
        if(!email || !password){
            res.status(422).json({error: "Please add Email or password"})
        }
        User.findOne({email:email})
        .then(savedUser => {
             // check whether the user email and pass is saved in DB if not print this
            if(!savedUser) {
                 return res.status(404).json({error: "Invalid email or password"}) 
            }
            // if user email and pass is saved in DB then compare with client password
            bcrypt.compare(password, savedUser.password)
            // doMatch is Boolean value : compares with client and DB 
            .then(doMatch => {
                if(doMatch){
                    // res.json({message: "successfully signed In"})

                    // generate the TOKEN
                    const token = jwt.sign({_id:savedUser._id} , JWT_SECRET)
                    const { _id, name, email, followers, following,pic} = savedUser
                        res.json({token, user: {_id, name, email, followers, following, pic}})
                }
                else{
                    return res.status(404).json({error:"Invalid Email or Password"})
                }
            })
            .catch(err => {
                console.log(err)
            })
        })
})
module.exports = router