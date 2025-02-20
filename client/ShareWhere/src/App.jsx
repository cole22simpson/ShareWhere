import Home from "./components/routed/home/Home.jsx"
import Signup from "./components/routed/signup/Signup.jsx"
import Nav from "./components/routed/nav/Nav.jsx"
import Login from "./components/routed/login/Login.jsx"
import AddLocation from "./components/routed/addLocation/AddLocation.jsx"
import AuthProvider from "./components/routed/authContext/AuthContext.jsx"
import UserProvider from "./components/routed/userContext/UserContext.jsx"
import Profile from "./components/routed/profile/Profile.jsx"
import Discover from "./components/routed/discover/Discover.jsx"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {

  return (
    <div className="app">
      <AuthProvider>
        <UserProvider>
          <Router>
            <Nav />
            <Routes>
              <Route path="/" exact element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/add-location' element={<AddLocation />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/discover' element={<Discover />} />
            </Routes>
          </Router>
        </UserProvider>
      </AuthProvider>
    </div>
  )
}

export default App
