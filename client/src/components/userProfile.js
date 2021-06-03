import React, { useEffect, useState, useContext } from 'react'
import '../style/profile.css'
import { UserContext } from '../App'
import { useParams } from 'react-router-dom'


export default function UserProfile() {
    const [userprofile, setUserProfile] =useState(null)
    const {state, dispatch} =useContext(UserContext)
    const {userid} =useParams()
    // console.log(userid)
    const [showFollow, setShowFollow] = useState(state?!state.following.includes(userid):true)

    useEffect ( () => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
            setUserProfile(result)
        })
    },[]) 

    // follow the user
    const followUser = () => {
        fetch('/follow' , {
            method: "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId:userid
            })
        }).then(res => res.json())
        .then(data => {
            console.log(data)
            dispatch({type: "UPDATE" , payload: {following:data.following, followers:data.followers}})
            localStorage.setItem("user", JSON.stringify(data))
            setUserProfile((previousState) => {
                return{
                    ...previousState,
                    user:{
                        ...previousState.user,
                        followers:[...previousState.user.followers, data._id]
                    }
                }
            })
            setShowFollow(false)
        })
    }
    const unfollowUser = () => {
        fetch('/unfollow' , {
            method: "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId:userid
            })
        }).then(res => res.json())
        .then(data => {
            console.log(data)
            dispatch({type: "UPDATE" , payload: {following:data.following, followers:data.followers}})
            localStorage.setItem("user", JSON.stringify(data))
            setUserProfile((previousState) => {
                 const newFollowers = previousState.user.followers.filter(item => item !== data._id)
                return{
                    ...previousState,
                    user:{
                        ...previousState.user,
                        followers:newFollowers
                    }
                }
            })  
            setShowFollow(true)
        }) 
    }

    return ( 
        <>
        {
            userprofile ? 
            
            <div className="full_container">
            <div className="top_container">
               
                <div className="image_container">
                    <img src={userprofile.user.pic} alt="" />
                </div>
                <div className="data_container">
                    <h2> {userprofile.user.name} </h2>
                    <h2> {userprofile.user.email} </h2>
                    <div className="post_container">
                        <h3> {userprofile.posts.length} Post</h3>
                        <h3> {userprofile.user.followers.length} Followers</h3>
                        <h3>  {userprofile.user.following.length}  Following</h3><br/>
                        </div>
                        {
                            showFollow?  <button class="btn waves-effect #9e9e9e grey"  onClick= { () => followUser() } > Follow </button>
                            :  <button class="btn waves-effect #e64a19 deep-orange darken-2"  onClick= { () => unfollowUser() } > UnFollow </button>
                        }
                </div>
            </div>
            <div className="gallery">
                {
                    userprofile.posts.map(item => {
                       return(
                        <img className= "item" src={item.photo} alt={item.title} key={item._id} />
                       )
                      
                    })
                }
              

            </div>
        </div>

            : <h2> Loading...!!!</h2>
        }
        
    </>
    )
}
