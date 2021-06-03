import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'
import '../style/navbar.css'

export default function Navbar() {
    const {state, dispatch} =useContext(UserContext)
    const history = useHistory()

    const renderFunction = () => {
        if(state){
                return [
                    <li><Link to="/profile" className="nav_list">My Profile</Link></li>,
                    <li><Link to="/create" className="nav_list">Create Post</Link></li>,
                    <li><Link to="/explore" className="nav_list"> Explore </Link></li>,
                    <li><button class="btn waves-effect waves-light "
                    onClick={ () => {
                        localStorage.clear()
                        dispatch({type:"CLEAR"})
                        history.push("/signin")
                    }}>Log Out</button> </li>
                ]
        }else{
            return [
                <li><Link to="/signup" className="nav_list">Sign Up</Link></li>,
                <li><Link to="/signin" className="nav_list">Sign In</Link></li>,
            ]
        }
    }
   
    return (
        <div>
        <nav>
            <div class="nav-wrapper #37474f blue-grey darken-3">
            <Link to={state? "/" : "/signin"} class="brand-logo left">SM Media</Link>
            <ul id="nav-mobile" class="right ">
               {renderFunction()}
            </ul>
            </div>
        </nav>
        </div>
    )
}
