import Home from "./components/routed/home/Home.jsx"
import Signup from "./components/routed/signup/Signup.jsx"
import Nav from "./components/routed/nav/Nav.jsx"
import Login from "./components/routed/login/Login.jsx"
import AuthProvider from "./components/routed/authContext/AuthContext.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {

  return (
    <div className="app">
      <AuthProvider>
        <Router>
          <Nav />
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path='/signup' element={<Signup />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  )
}

export default App
