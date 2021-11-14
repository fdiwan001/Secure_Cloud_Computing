import React from "react"
import Signup from "./Authentication/Signup"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom"
import Profile from "./Authentication/Profile"
import Login from "./Authentication/Login"
import PrivateRoute from "./Authentication/PrivateRoute"
import ForgotPassword from "./Authentication/ForgotPassword"
import UpdateProfile from "./Authentication/UpdateProfile"
import Dashboard from "./Drive/Dashboard"
import ShareDashboard from "./Drive/ShareDashboard"

import Doc from "./Document/Doc"
import TextEditor from "./Document/TextEditor"
import {v4 as uuidV4 } from "uuid"

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          {/* Drive */}
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute exact path="/folder/:folderId" component={Dashboard} />

          {/* Docs */}
          <PrivateRoute exact path="/viewall" component={Doc} />

          <PrivateRoute exact path="/create">  
            <Redirect to ={`/documents/${uuidV4()}`} />
          </PrivateRoute>
          
          <PrivateRoute exact path="/documents/:id" component={TextEditor} />
          {/*Shared Drive*/}
          <PrivateRoute path="/shared" component={ShareDashboard} />
          <PrivateRoute path="/folder/:folderId" component={ShareDashboard} />

          {/* Profile */}
          <PrivateRoute path="/user" component={Profile} />
          <PrivateRoute path="/update-profile" component={UpdateProfile} />

          {/* Auth */}
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/forgot-password" component={ForgotPassword} />
        </Switch>
      </AuthProvider>
    </Router>
  )
}

export default App
