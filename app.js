const express = require("express")
const mongoose =require("mongoose")

const PORT = process.env.PORT || 3000
const app=express()

require("./blueprint/user")
require("./blueprint/post")

app.use(express.json())

app.use(require('./router/auth'))
app.use(require('./router/post'))
app.use(require('./router/user'))


const {MONGOURI} = require('./config/keys')

mongoose.connect(MONGOURI,{
    useUnifiedTopology: true,
    useNewUrlParser: true
})

mongoose.connection.on("connected", () => {
    console.log(" Successfully Connected to MongoDB Server")
})
mongoose.connection.on("error", (err) => { 
    console.log("error in connecting", err)
})

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path =require('path')
    app.get("*", (req,res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}

app.listen(PORT, () =>  { console.log("Your app running in ", PORT)})