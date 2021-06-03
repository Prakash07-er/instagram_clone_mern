import React, { useEffect, useState, useContext} from 'react'
import '../style/home.css'
import { UserContext } from "../App"
import { Link } from 'react-router-dom'

export default function Home() {
    const [data,setData] = useState([])
    const {state, dispatch} = useContext(UserContext)
    useEffect ( () => {
            fetch("/allpost" , {
                headers:{
                    "Authorization": "Bearer "+localStorage.getItem("jwt")
                }
            })
            .then(res => res.json())
            .then(result => {
                    console.log(result)
                    setData(result.post)
                })
    },[])

        // Like section
        const likesPost = (id) => {
            fetch('/like',{
                method : "put",
                headers:{
                    "Content-Type" : "application/json",
                    "Authorization": "Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    postId : id
                })
            })
            .then (res => res.json())
            .then (result => {
                // console.log(result)
                const newData = data.map(item => {
                    if(item._id===result._id) {
                        return result
                    }else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
        }

        // Unlike section
        const UnlikesPost = (id) => {
            fetch('/unlike',{
                method : "put",
                headers:{
                    "Content-Type" : "application/json",
                    "Authorization": "Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    postId:id
                })
            })
            .then (res => res.json())
            .then (result => {
                // console.log(result)
                const newData = data.map(item => {
                    if(item._id===result._id) {
                        return result
                    }else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })

        }

        // Make a comment section
        const makeComment = (text, postId) => {
            fetch('/comment' , {
                method :'put',
                headers : {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    postId,
                    text
                })
            }) .then(res => res.json())
            .then (result => {
                console.log(result)
                const newData = data.map(item => {
                    if(item._id===result._id) {
                        return result
                    }else {
                        return item
                    }
                })
                setData(newData)
            })
            .catch(err => {
                console.log(err)
            })
        }


        const deletePost = (postid) => {
            fetch(`/deletepost/${postid}` , {
                method:"delete",
                headers: {
                    "Authorization": "Bearer "+localStorage.getItem("jwt")
                }
            })
            .then(res => res.json)
            .then(result => {
                console.log(result)
                const newData = data.filter(item => {
                    return  item._id !== result._id
                })
                setData(newData)
            })
        }

        // {item.postedBy.name}    item.postedBy._id == state._id
        return (
        <div className="home">
            {
                data.map(item => {
                    console.log(item)
                    return (
                        <div className="card  home-card blue-grey darken-1" key={item._id}>
                        <h2><Link to={item.postedBy._id !== state._id ? `/profile/${item.postedBy._id}` : "/profile"} className="card_heading" >{item.postedBy.name} </Link>  </h2> 
                        <div className="card-image">
                            <img   src={item.photo} alt= "picture_loading_wait....!!" />
                        </div>
                        <div className="card-content">
                        <i className="material-icons heart">favorite</i>
                        {item.likes.includes(state._id)
                        ? <i className="material-icons thumb_down"  onClick={ () => {UnlikesPost(item._id)}}>thumb_down</i>
                        :  <i className="material-icons thumb_up" onClick={ () => {likesPost(item._id)}}>thumb_up</i>
                        }
                             <h2 className="Likes"> { item.likes.length } Likes </h2>
                            <h2> { item.title } </h2>
                            <p>  { item.body } </p>
                            {
                                item.comments.map(record => {
                                   
                                    return (
                                        // console.log(record)
                                        <h3 className="comment"><span className="comment_name"> {item.postedBy.name} : </span> {record.text} </h3>
                                    )
                                })
                            }
                            <form  onSubmit={ (e) => {
                                e.preventDefault()
                                makeComment(e.target[0].value, item._id)
                                // console.log( item.postedBy.name, e.target[0].value )
                            }}>
                                 <input id="icon_prefix" type="text" placeholder="add a comment" />

                            </form>
                            {item.postedBy._id === state._id 
                             &&  <i class="material-icons delete"  onClick={() => deletePost(item._id) }>delete_sweep</i>
                            }
                        </div>
                    </div>
                    )
                })
            }
           
        </div>
    )
}
