import React, { useEffect, useState, useContext } from 'react'
import '../style/profile.css'
import { UserContext } from '../App'


export default function Profile() {
    const [mypics, setMypics] =useState([])
    const {state, dispatch} =useContext(UserContext)
    const [image, setImage] = useState("")
    // const [url, setUrl] = useState("")
    console.log(state)
    useEffect ( () => {
        fetch('/mypost', {
            headers: {
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
            setMypics(result.mypost)
        })
    },[]) 

    useEffect ( () => {
        if(image){
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
                console.log(data)
                // if you need you can use secure_url instead of url
                

                fetch('/updatepic', {
                    method:"put",
                    headers:{
                        'Content-Type': "application/json",
                        "Authorization" : "Bearer "+localStorage.getItem("jwt")
                    },
                    body: JSON.stringify({
                        pic: data.url
                    })
                }).then(res=>res.json())
                .then(result => {
                    console.log(result)
                    localStorage.setItem("user", JSON.stringify({...state,pic:result.pic}))
                     dispatch({type:"UPDATEPIC", payload:result.pic})
                })

               
            })
            .catch(err => {
                console.log(err)
            })
        }
    },[image])

    const updatePhoto = (file) => {
        setImage(file)
    }

    return (
        <div className="full_container">
            <div className="top_container">
               <div>
                   <div className="image_container">
                    <img src={state?state.pic:"no profile pic"} alt="" />
                  </div>
                  <div class="file-field input-field #e0e0e0 grey lighten-2 ">
                        <div class="btn">
                            <span>Upload Profile </span>
                            <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
                        </div>
                        <div class="file-path-wrapper">
                            <input class="file-path validate" type="text" />
                        </div>
                    </div>
                </div>
                
                <div className="data_container">
                    <h2> {state?state.name : "loading..>!!"} </h2>
                    <div className="post_container">
                        <h3> {mypics.length} Post</h3>
                        <h3> {state?state.followers.length:"0"} followers</h3>
                        <h3> {state?state.following.length:"0"} following</h3>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    mypics.map(item => {
                       return(
                        <img className= "item" src={item.photo} alt={item.title} key={item._id} />
                       )
                      
                    })
                }
              

            </div>
        </div>
       
    )
}
