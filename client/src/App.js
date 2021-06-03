import React, { useEffect, createContext, useReducer, useContext } from 'react'
import './App.css'
import Navbar from "./components/navbar"
import Home from "./components/home"
import Profile from "./components/profile"
import Signin from "./components/signin"
import Signup from "./components/signup"
import Createpost from "./components/createpost"
import UserProfile from "./components/userProfile"
import SubscribeUserPost from "./components/subscribeUserPost"

import {reducer, initialState} from './reducers/userReducer'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)
  useEffect ( () => {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER", payload:user})
    }else{
      history.push("/signin")
    }
  },[])

  return(
    <Switch>
    <div className="App">
      <Navbar />
      <Route path="/" exact={true} > <Home /> </Route>
      <Route path="/signup" exact={true} > <Signup /> </Route>
      <Route path="/signin" exact={true}> <Signin /> </Route>
      <Route path="/profile" exact={true} > <Profile /> </Route>
      <Route path="/create" exact={true} > <Createpost /> </Route>
      <Route path="/profile/:userid" exact={true} > <UserProfile /> </Route>
      <Route path="/explore" exact={true} > <Home /> </Route>

    </div>
  </Switch>
  )
}



function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{state, dispatch}}>

    <Router>
      <div className="container">
          <Routing />
      </div>
    </Router>
    </UserContext.Provider>
  );
}

export default App;
