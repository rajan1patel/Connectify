import React, { useContext } from 'react'
import { Navigate, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Loginpage from './pages/Loginpage'
// import Profile from './pages/Profile'
import { Routes } from 'react-router-dom'
import ProfilePage from './pages/ProfilePage'
import {Toaster} from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'

const App = () => {
const {authUser}=useContext(AuthContext);




 
  return (
    <div className="bg-black bg-contain">

      
      <Toaster/>
      <Routes>
        <Route path="/" element={authUser?<HomePage />:<Navigate to="/login" />} />
        <Route path="/login" element={authUser?<Navigate to="/" />:<Loginpage />} />
        <Route path="/profile" element={authUser?<ProfilePage/>:<Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App