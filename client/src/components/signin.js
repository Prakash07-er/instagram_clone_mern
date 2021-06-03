import React, { useState, useContext } from 'react'
import '../style/signin.css'
import { Link , useHistory} from 'react-router-dom'
import M from "materialize-css"
import {UserContext} from '../App'



export default function Signin() {
    const {state, dispatch} =useContext(UserContext)
    const history  = useHistory()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    
    const PostData = () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Invalid Email Address" , classes : "#d32f2f red darken-2"})
            return
        }
        fetch("/signin" , {
            method : "post",
            headers :{
                "Content-Type" : "application/json"
            },
            body : JSON.stringify( {
                email,
                password
            })
        }).then(res =>  res.json())
        .then(data => {
            console.log(data)
            if(data.error) {
                M.toast({html: data.error , classes : "#d32f2f red darken-2"})
            }
            else{
                localStorage.setItem("jwt", data.token )
                localStorage.setItem("user", JSON.stringify(data.user)) // in console it will only have JSON
                dispatch({type:"USER", payload:data.user})
                M.toast({html: "Signed In Successfully..!" , classes : "#43a047 green darken-1"})
                history.push('/')
            }
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <div className= "row input-field" id="login_card">
            <div className="card col-md-4 blue-grey darken-1 ">
               <h2>Sign In</h2>
               <input id="icon_prefix" type="text" placeholder="enter email"
                value={email} onChange= { (e) => setEmail(e.target.value)} />
                <input type="password" placeholder="enter password" 
                value={password} onChange= { (e) => setPassword(e.target.value)} />
                <button class="btn waves-effect waves-light"  onClick= { () => PostData() } >Login
                    <i class="material-icons right">send</i>
                </button>
                <h5>
                    <Link to="/signup" className="No_account my-3"> Don't have an account ?</Link>
                </h5>
            </div>
        </div>
    )
}
