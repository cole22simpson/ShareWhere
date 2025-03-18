import { useState, useEffect } from 'react';
import "./nav.css"
import { IconContext } from 'react-icons';
import { Link, useNavigate } from 'react-router-dom';
import { FaGlobeAmericas, FaPlusCircle, FaSearch } from 'react-icons/fa';
import { GiTreeSwing } from "react-icons/gi";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { AiFillHome } from "react-icons/ai"
import { FaBars, FaCircleUser, FaXmark } from "react-icons/fa6";
import { MdOutlineLogout, MdClose } from 'react-icons/md'
import useAuth from '../authContext/useAuth';

function Nav() {
    const [sidebar, setSidebar] = useState(false);
    const { userLoggedIn, setUserLoggedIn } = useAuth();
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const showSidebar = () => {
        setSidebar(!sidebar);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
    
            if (response.ok) {
                document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain=.sharewheresocial.com";
                // localStorage.removeItem("user");
                // localStorage.removeItem("userId");
                // localStorage.removeItem("name");
                // localStorage.removeItem("city");
                setUserLoggedIn(false);
            } else {
                console.error("Logout failed on the backend with status:", response.status);
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <IconContext.Provider value={{ color: 'black' }}>
            <div className='navbar'>
                <div className="logo-link-container" onClick={() => navigate("/")}>
                    <div className="logo-container">
                        <GiTreeSwing className="logo" />
                        <p className="title">&nbsp;ShareWhere</p>
                    </div>
                </div>
                <div className='hamburger-menu-wrap'>
                    <div className='hamburger-menu-img'  onClick={showSidebar}>
                        <FaBars />
                    </div>
                </div>

                <nav className='pc-nav'>
                    <ul className='nav-menu-items'>
                        <li className="nav-item" onClick={() => navigate("/")}>
                            <AiFillHome className='nav-icon' />
                            <span>Home</span>
                        </li>
                    
                        <li className="nav-item" onClick={() => navigate("/discover")}>
                            <FaGlobeAmericas className='nav-icon' />
                            <span>Discover</span>
                        </li>
                        <li className="nav-item" onClick={userLoggedIn ? () => navigate("/add-location") : () => navigate("/login")}>
                                <FaPlusCircle className='nav-icon' />
                                <span>Add location</span>
                        </li>
                        
                        <li className="nav-item" onClick={userLoggedIn ? () => navigate("/profile") : () => navigate("/login")}>
                                <FaCircleUser className='nav-icon' />
                                <span>Profile</span>
                        </li>

                        {userLoggedIn ? (
                            <>
                                <li className="nav-item" onClick={handleLogout}>
                                    <MdOutlineLogout className='nav-icon' />
                                    <span>Logout</span>
                                </li>
                            </>
                            ) : (
                                <li className='nav-item' onClick={() => {navigate("/login")}}>
                                    <FiLogIn className="nav-icon" />
                                    <span>Login</span>
                                </li>
                            )} 
                    </ul>
                </nav>
            </div>
        
    
                <nav className={`sidebar-active ${sidebar ? 'show' : ''}`} style={{ zIndex: 99 }}>                <ul className='sidebar-menu-items' onClick={showSidebar}>
                    <li className="sidebar-item close-sidebar">
                        <MdClose onClick={() => setSidebar(false)} className='sidebar-icon' />
                    </li>
                    <li className="sidebar-item" onClick={() => navigate("/")}>
                        <FaSearch className='sidebar-icon' />
                        <span>Home</span>
                    </li>
                    <li className="sidebar-item" onClick={() => navigate("/discover")}>
                            <FaGlobeAmericas className='sidebar-icon' />
                            <span>Discover</span>
                    </li>
                    <li className="sidebar-item" onClick={userLoggedIn ? () => navigate("/add-location") : () => navigate("/login")}>
                            <FaPlusCircle className='sidebar-icon' />
                            <span>Add location</span>
                    </li>

                    <li className="sidebar-item" onClick={userLoggedIn ? () => navigate("/profile") : () => navigate("/login")}>
                            <FaCircleUser className='sidebar-icon' />
                            <span>Profile</span>
                    </li>
                    {userLoggedIn ? (
                        <>
                            <li className='sidebar-item' onClick={handleLogout}>
                                    <FiLogOut className="sidebar-icon" />
                                    <span>Logout</span>
                            </li>
                        </>
                    ) : (
                        <li className='sidebar-item' onClick={() => navigate("/login")}>
                                <FiLogIn className="sidebar-icon" />
                                <span>Login</span>
                        </li>
                    )}
                </ul>
            </nav>
        </IconContext.Provider>
    );
}

export default Nav;