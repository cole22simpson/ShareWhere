import { useState } from 'react';
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
// import signOut from "../../../api/users/signOut"



function Nav() {

    const [sidebar, setSidebar] = useState(false);
    const { userLoggedIn, setUserLoggedIn } = useAuth();

    const showSidebar = () => {
        setSidebar(!sidebar);
    };

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userData");
        setUserLoggedIn(false);
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
                <a href="/" className="img-wrap">
                    <h1 className="title"><span className="logo"><GiTreeSwing /></span>ShareWhere</h1>
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
                                    <Link to='/saved'>
                                        <FaIcons.FaBookmark className='nav-icon' />
                                        <span>Saved</span>
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