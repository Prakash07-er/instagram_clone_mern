import React, { useEffect, useState } from 'react'
import '../style/signin.css'
import M from "materialize-css"
import { Link, useHistory } from 'react-router-dom'


export default function Signup() {
    const history  = useHistory()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)

    useEffect ( () => {
        if(url){
            uploadFields()
        }
    },[url])

    const uploadPic = () => {
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

    const uploadFields = () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Invalid Email Address" , classes : "#d32f2f red darken-2"})
            return
        }
        fetch("/signup" , {
            method : "post",
            headers :{
                "Content-Type" : "application/json"
            },
            body : JSON.stringify( {
                name,
                email,
                password,
                pic:url
            })
        }).then(res =>  res.json())
        .then(data => {
            if(data.error) {
                M.toast({html: data.error , classes : "#d32f2f red darken-2"})
            }
            else{
                M.toast({html:data.message , classes : "#43a047 green darken-1"})
                history.push('/signin')
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const PostData = () => {
        if(image){
            uploadPic()
        }else{
            uploadFields()
        }
    }

    return (
        <div className= "row input-field" id="login_card">
            <div className="card col--md-4 blue-grey darken-1">
                <h2>Sign Up</h2>
                <input id="icon_prefix" type="text" placeholder="enter name" 
                value={name} onChange= { (e) => setName(e.target.value)} />
                <input id="icon_prefix" type="text" placeholder="enter email"
                value={email} onChange= { (e) => setEmail(e.target.value)} />
                <input type="password" placeholder="enter password" 
                value={password} onChange= { (e) => setPassword(e.target.value)} />
                    <div class="file-field input-field">
                        <div class="btn">
                            <span>Upload Profile Picture</span>
                            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                        </div>
                        <div class="file-path-wrapper">
                            <input class="file-path validate" type="text" />
                        </div>
                    </div>
                <button class="btn waves-effect waves-light" onClick= { () => PostData() } >Sign Up
                    <i class="material-icons right">send</i>
                </button>
                <h5>
                    <Link to="/signin" className="No_account"> Already have an account ?</Link>
                </h5>
        
            </div>
        </div>
    )
}
