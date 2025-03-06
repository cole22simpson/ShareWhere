import { useState, useEffect } from 'react';
import "./nav.css"
import { IconContext } from 'react-icons';
import { Link } from 'react-router-dom';
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

    const showSidebar = () => {
        setSidebar(!sidebar);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include", // Send the cookie with the request
            });
    
            if (response.ok) {
                localStorage.removeItem("jwtToken");
                localStorage.removeItem("userData");
                localStorage.removeItem("userId");
                localStorage.removeItem("name");
                localStorage.removeItem("city");
                localStorage.removeItem("coords");

                setUserLoggedIn(false);
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <IconContext.Provider value={{ color: 'black' }}>
            <div className='navbar'>
                <a href="/" className="logo-link-container">
                    <div className="logo-container">
                        <GiTreeSwing className="logo" />
                        <p className="title">&nbsp;ShareWhere</p>
                    </div>
                </a>
                <Link to='#' className='hamburger-menu-wrap'>
                    <div className='hamburger-menu-img'  onClick={showSidebar}>
                        <FaBars />
                    </div>
                </Link>

                <nav className='pc-nav'>
                    <ul className='nav-menu-items'>
                        <li className="nav-item">
                            <Link to='/'>
                                <AiFillHome className='nav-icon' />
                                <span>Home</span>
                            </Link>
                        </li>
                    
                        <li className="nav-item">
                            <Link to='/discover'>
                                <FaGlobeAmericas className='nav-icon' />
                                <span>Discover</span>
                            </Link>
                        </li>

                        {userLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <Link to='/add-location'>
                                        <FaPlusCircle className='nav-icon' />
                                        <span>Add location</span>
                                    </Link>
                                </li>
                                
                                <li className="nav-item">
                                    <Link to='/profile'>
                                        <FaCircleUser className='nav-icon' />
                                        <span>Profile</span>
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <a href="/" onClick={handleLogout}>
                                        <MdOutlineLogout className='nav-icon' />
                                        <span>Logout</span>
                                    </a>
                                </li>
                            </>
                            ) : (
                                <li className='nav-item'>
                                    <Link to='/login'>
                                        <FiLogIn className="nav-icon" />
                                        <span>Login</span>
                                    </Link>
                                </li>
                            )} 
                    </ul>
                </nav>
            </div>
        
    
                <nav className={`sidebar-active ${sidebar ? 'show' : ''}`} style={{ zIndex: 99 }}>                <ul className='sidebar-menu-items' onClick={showSidebar}>
                    <li className="sidebar-item close-sidebar">
                        <MdClose onClick={() => setSidebar(false)} className='sidebar-icon' />
                    </li>
                    <li className="sidebar-item">
                        <Link to='/'>
                            <FaSearch className='sidebar-icon' />
                            <span>Home</span>
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link to='/discover'>
                            <FaGlobeAmericas className='sidebar-icon' />
                            <span>Discover</span>
                        </Link>
                    </li>
                    {userLoggedIn ? (
                        <>
                            <li className="sidebar-item">
                                <Link to='/add-location'>
                                    <FaPlusCircle className='sidebar-icon' />
                                    <span>Add location</span>
                                </Link>
                            </li>

                            <li className="sidebar-item">
                                <Link to='/profile'>
                                    <FaCircleUser className='sidebar-icon' />
                                    <span>Profile</span>
                                </Link>
                            </li>
                            <li className='sidebar-item' onClick={handleLogout}>
                                <Link to='/'>
                                    <FiLogOut className="sidebar-icon" />
                                    <span>Logout</span>
                                </Link>
                            </li>
                        </>
                    ) : (
                        <li className='sidebar-item'>
                            <Link to='/login'>
                                <FiLogIn className="sidebar-icon" />
                                <span>Login</span>
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>
        </IconContext.Provider>
    );
}

export default Nav;
