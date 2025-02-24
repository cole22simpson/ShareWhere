import { useState, useEffect } from 'react';
import "./nav.css"
import { IconContext } from 'react-icons';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as FaIcons6 from 'react-icons/fa6';
import { GiTreeSwing } from "react-icons/gi";
import { FiLogIn } from "react-icons/fi";
import { AiFillHome } from "react-icons/ai"
import { MdOutlineLogout } from 'react-icons/md'
import useAuth from '../authContext/useAuth';

function Nav() {
    const [sidebar, setSidebar] = useState(false);
    const { userLoggedIn, setUserLoggedIn } = useAuth();

    const showSidebar = () => {
        setSidebar(!sidebar);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:8080/auth/logout", {
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
                <Link to='#' className='hamburger-menu-wrap'>
                    <img
                        src={""}
                        onClick={showSidebar}
                        alt='hamburger menu'
                        className='hamburger-menu-img' />
                </Link>
                <a href="/" className="logo-link-container">
                    <div className="logo-container">
                        <GiTreeSwing className="logo" />
                        <p className="title">&nbsp;ShareWhere</p>
                    </div>
                </a>

                <nav className='pc-nav'>
                    <ul className='nav-menu-items' onClick={showSidebar}>
                        <li className="nav-item">
                            <Link to='/'>
                                <AiFillHome className='nav-icon' />
                                <span>Home</span>
                            </Link>
                        </li>
                    
                        <li className="nav-item">
                            <Link to='/discover'>
                                <FaIcons.FaGlobeAmericas className='nav-icon' />
                                <span>Discover</span>
                            </Link>
                        </li>

                        {userLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <Link to='/add-location'>
                                        <FaIcons.FaPlusCircle className='nav-icon' />
                                        <span>Add location</span>
                                    </Link>
                                </li>
                                
                                <li className="nav-item">
                                    <Link to='/profile'>
                                        <FaIcons6.FaCircleUser className='nav-icon' />
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
        
    
            <nav className={sidebar ? 'nav active' : 'nav'} style={{ zIndex: 99 }}>
                <ul className='nav-menu-items' onClick={showSidebar}>
                    <li className='navbar-toggle'>
                        <Link to='#' className='hamburger-menu-wrap'>
                            <FaIcons6.FaXmark />
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/'>
                            <FaIcons.FaSearch className='nav-icon' />
                            <span>Home</span>
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link to='/add-location'>
                            <FaIcons.FaPlusCircle className='nav-icon' />
                            <span>Add location</span>
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link to='/profile'>
                            <FaIcons6.FaCircleUser className='nav-icon' />
                            <span>Profile</span>
                        </Link>
                    </li>

                    <li className='nav-item'>
                        <Link to='/login'>
                            <FiLogIn className="nav-icon" />
                            <span>Login</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </IconContext.Provider>
    );
}

export default Nav;
