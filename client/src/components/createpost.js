import React, { useState, useEffect } from 'react'
import M from "materialize-css"
import { useHistory } from 'react-router-dom'


export default function Createpost() {
    const history  = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

    useEffect (() => {
        if(url) {
             // creating the post
        fetch("/createpost" , {
            method : "post",
            headers :{
                "Content-Type" : "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body : JSON.stringify( {
                title,
                body,
                pic: url
            })
        }).then(res =>  res.json())
        .then(data => {
            console.log(data)
            if(data.error) {
                M.toast({html: data.error , classes : "#d32f2f red darken-2"})
            }
            else{
                M.toast({html: "Created Post Successfully..!" , classes : "#43a047 green darken-1"})
                history.push('/')
            }
        }).catch(err => {
            console.log(err)
        })
        }
    },[url])

    //uploading photo to cloudinary
    const postDetails = () => {
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","social_media_MERN")
        data.append("cloud_name","dj0pjewbs")
        fetch("https://api.cloudinary.com/v1_1/dj0pjewbs/image/upload", {
            method : "post",
            body: data
        })
        .then(res => res.json())
        .then(data => {
            setUrl(data.url) // if you need you can use secure_url instead of url
        })
        .catch(err => {
            console.log(err)
        })

       
    }

    return (
        <div className="card input_field blue-grey darken-1">
            <input id="icon_prefix" type="text" placeholder="enter title" 
             value={title} onChange= { (e) => setTitle(e.target.value)}/>
            <input id="icon_prefix" type="text" placeholder="enter body"
             value={body} onChange= { (e) => setBody(e.target.value)} />
                <div class="file-field input-field">
                <div class="btn">
                    <span>Upload Image</span>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                </div>
                <div class="file-path-wrapper">
                    <input class="file-path validate" type="text" />
                </div>
                </div>
                <button class="btn waves-effect waves-light darken-1" 
                onClick= {() => postDetails()} >Submit Post
                    <i class="material-icons right">send</i>
                </button>
        </div>
    )
}
