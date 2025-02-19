import "./profile.css";
import { useState, useEffect } from "react";
import EditModal from "../profileModal/EditModal";
import { FaBookmark } from 'react-icons/fa';
import { MdOutlineGridOn } from "react-icons/md";
import UseAnimations from "react-useanimations";
import loading from 'react-useanimations/lib/loading';
import Posts from "../posts/Posts";
import Saved from "../saved/Saved";

function Profile() {
    const [username, setUsername] = useState("");
    const userNameClass = getUsernameClass(username);
    const [name, setName] = useState("");
    const [numPosts, setNumPosts] = useState(0);
    const [bio, setBio] = useState("");
    // const [hideBackground, setHideBackground] = useState(false);
    const [profilePicUrl, setProfilePicUrl] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPosts, setShowPosts] = useState(true);

    function handleShowPosts() {
        setShowPosts(true);
    };

    function handleShowSaved() {
        setShowPosts(false);
    }

    function getUsernameClass(username) {
        const length = username.length;
        if (length <= 10) {
            return "big";
        } else if (length <= 20) {
            return "medium";
        } else if (length <= 30) {
            return "small";
        } else {
            return "";
        }
    }


    const loadProfile = async () => {
        setIsLoading(true);

        try {
            const userId = localStorage.getItem("userId");
            const response = await fetch(`http://localhost:8080/users/${userId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            });

            if (!response.ok) { // Check for errors first!
                const errorData = await response.json(); // Or response.text() for non-JSON errors
                console.error("Error fetching user:", response.status, errorData);
                return; // Or throw an error, or handle it as needed
            }
            
            try {
                const userData = await response.json(); // Extract the JSON data
                setUsername(userData.username);
                setNumPosts(userData.profile.userPosts.length);
                setName(userData.name);
                setBio(userData.profile.bio);
                setProfilePicUrl(userData.profile.profilePic.imageUrl);   
                                
                if (profilePicUrl !== "") {  // Important: Check if image data exists
                    const imgElement = document.getElementById('profile-pic');
                    if(imgElement) {
                        imgElement.src = '/assets/images/default-image.png';
                    } else {
                        console.error("Image element not found!")
                    }
                }
            } catch (error) {
                console.error("Error parsing JSON:", error); // Handle JSON parsing errors
            }

        } catch (error) {
            console.error("Error loading user:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadProfile();
    }, []);

    function handleButtonClick() {
        setShowEditModal(true);
    }

    function handleBackToProfile() {
        setShowEditModal(false);
    }

    return (
        <>
            {isLoading ? (
                <div className="loading"><UseAnimations animation={loading} size={56} /></div>
            ) : (
                <div className="profile-page">
                    <div className="profile-container">
                        {showEditModal ? (
                            <EditModal
                            username={username}
                            name={name}
                            bio={bio}
                            profilePicUrl={profilePicUrl}
                            backToProfile={handleBackToProfile} />
                        ) : (
                            <>
                                <div className="attributes-container">
                                    <div className="profile-pic-container">
                                        <img id="profile-pic" src={profilePicUrl} />
                                    </div>
                                    <div className="attributes">
                                        <div className="username-row">
                                        <p className={`username ${userNameClass}`}>{username}</p>
                                            <button className="edit-profile" onClick={handleButtonClick}>Edit profile</button>
                                        </div>
                                        <div className="account-stats">
                                            <p className="stat" id="posts"><span>{numPosts}</span> posts</p>
                                            <p className="stat" id="followers"><span>250</span> followers</p>
                                            <p className="stat" id="following"><span>42</span> following</p>
                                        </div>
                                        <p className="name">{name}</p>
                                        <p className="bio">{bio}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="pick-content-container">
                                    <div className={`pick-content-btn ${showPosts ? 'chosen' : ''}`} onClick={handleShowPosts}>
                                        <MdOutlineGridOn/>
                                    </div>
                                    <div className={`pick-content-btn ${showPosts ? '' : 'chosen'}`} onClick={handleShowSaved}>
                                        <FaBookmark/>
                                    </div>
                                </div>
                                <hr />
                                {showPosts && (
                                    <Posts />
                                )}
                                {!showPosts && (
                                    <Saved />
                                )}
                                
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Profile;