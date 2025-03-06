import "./profile.css";
import { useState, useEffect } from "react";
import EditModal from "../profileModal/EditModal";
import { FaBookmark } from 'react-icons/fa';
import { useParams } from "react-router-dom";
import { MdOutlineGridOn } from "react-icons/md";
import UseAnimations from "react-useanimations";
import loading from 'react-useanimations/lib/loading';
import Posts from "../posts/Posts";
import Saved from "../saved/Saved";
import useAuth from "../authContext/useAuth";
import { useNavigate } from "react-router-dom";

function Profile() {
    const { user_id } = useParams();
    const [userId, setUserId] = useState(null);
    const [ownProfile, setOwnProfile] = useState(false);
    const [username, setUsername] = useState("");
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const userNameClass = getUsernameClass(username);
    const [name, setName] = useState("");
    const [numPosts, setNumPosts] = useState(0);
    const [numFollowers, setNumFollowers] = useState(0);
    const [numFollowing, setNumFollowing] = useState(0);
    const [bio, setBio] = useState("");
    const [profilePicUrl, setProfilePicUrl] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPosts, setShowPosts] = useState(true);
    const [isFollowed, setIsFollowed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 450);

    useEffect(() => {
        function handleResize() {
        setIsMobile(window.innerWidth < 450);
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            const loggedInUserId = localStorage.getItem("userId");
            const profileUserId = user_id || loggedInUserId;
            setUserId(profileUserId);
            setOwnProfile(profileUserId === loggedInUserId);

            const response = await fetch(`${API_BASE_URL}/api/users/${profileUserId}`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                console.error("Error fetching user:", response.status);
                return;
            }

            const userData = await response.json();
            setUsername(userData.username);
            setNumPosts(userData.profile.userPosts.length);
            setNumFollowers(userData.followers.length);
            setNumFollowing(userData.following.length);
            setIsFollowed(userData.followers.includes(parseInt(loggedInUserId))); // ✅ Fix here
            setName(userData.name);
            setBio(userData.profile.bio);
            setProfilePicUrl(userData.profile.profilePic.imageUrl);
        } catch (error) {
            console.error("Error loading user:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {    
        loadProfile();
    }, [user_id, showEditModal]); // ✅ Removed isFollowed to prevent infinite re-renders
    
    const handleFollow = async (event, action) => {
        event.preventDefault();
    
        const type = action;
        const followerId = localStorage.getItem("userId");
    
        const formData = new FormData();
        formData.append("follower_id", followerId);
        formData.append("followee_id", user_id); // ✅ Use user_id instead of userId
        formData.append("action", type);
    
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/follow`, {
                method: "PATCH",
                credentials: "include",
                body: formData
            });
    
            if (response.ok) {
                setIsFollowed(!isFollowed);
                if (action === "FOLLOW") {
                    setNumFollowers(numFollowers + 1);
                }
                else if (action === "UNFOLLOW") {
                    setNumFollowers(numFollowers - 1);
                }
            } else {
                console.error("Follow failed: ", await response.text());
            }
        } catch (error) {
            console.error("Error during follow: ", error);
        }
    };

    const handleBackToProfile = () => {
        setShowEditModal(false);
    };

    const handleButtonClick =() => {
        setShowEditModal(true);
    }
    

    return (
        <>
            {isLoading ? (
                <div className="loading"><UseAnimations animation={loading} size={56} /></div>
            ) : (
                <div className="profile-page">
                    <div className={`profile-container ${showEditModal ? "modal-open" : ""}`}>
                        {showEditModal ? (
                            <EditModal
                                username={username}
                                name={name}
                                bio={bio}
                                profilePicUrl={profilePicUrl}
                                backToProfile={handleBackToProfile}
                            />
                        ) : (
                            <>
                                {!isMobile ? (
                                    <>
                                        <div className="attributes-container">
                                            <div className="profile-pic-container">
                                                <img id="profile-pic" src={profilePicUrl || '/assets/images/default-image.png'} alt="Profile" />
                                            </div>
                                            <div className="attributes">
                                                <div className="username-row">
                                                    <p className={`username ${userNameClass}`}>{username}</p>
                                                        {ownProfile ? (
                                                            <button
                                                                className="edit-profile"
                                                                onClick={handleButtonClick}>
                                                                    Edit profile
                                                            </button>
                                                        ) : (
                                                            <>
                                                                {isFollowed ? (
                                                                    <button className="edit-profile follow following" onClick={(e) => handleFollow(e, "UNFOLLOW")}>Following</button>
                                                                ) : (
                                                                    <button className="edit-profile follow" onClick={(e) => handleFollow(e, "FOLLOW")}>Follow</button>
                                                                )}
                                                            </>
                                                        )}
                                                </div>
                                                <div className="account-stats">
                                                    <p className="stat"><span>{numPosts}</span> posts</p>
                                                    <p className="stat"><span>{numFollowers}</span> followers</p>
                                                    <p className="stat"><span>{numFollowing}</span> following</p>
                                                </div>
                                                <p className="name">{name}</p>
                                                <p className="bio">{bio}</p>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="pick-content-container">
                                            <div className={`pick-content-btn ${showPosts ? 'chosen' : ''}`} onClick={() => setShowPosts(true)}>
                                                <MdOutlineGridOn />
                                            </div>
                                            {ownProfile && (
                                                <div className={`pick-content-btn ${showPosts ? '' : 'chosen'}`} onClick={() => setShowPosts(false)}>
                                                    <FaBookmark />
                                                </div>
                                            )}
                                        </div>
                                        <hr />
                                        {showPosts ? <Posts userId={userId} /> : <Saved />}
                                    </>
                                    ) : (
                                        <>
                                        <div className="attributes-container">
                                            <div className="attributes">
                                                <div className="username-row">
                                                    <div className="profile-pic-container">
                                                        <img id="profile-pic" src={profilePicUrl || '/assets/images/default-image.png'} alt="Profile" />
                                                    </div>
                                                    <div className="small-profile-info">
                                                        <div className="small-profile-top">
                                                            <p className={`username ${userNameClass}`}>{username}</p>
                                                                {ownProfile ? (
                                                                    <button
                                                                        className="edit-profile"
                                                                        onClick={handleButtonClick}>
                                                                            Edit profile
                                                                    </button>
                                                                ) : (
                                                                    <>
                                                                        {isFollowed ? (
                                                                            <button className="edit-profile follow following" onClick={(e) => handleFollow(e, "UNFOLLOW")}>Following</button>
                                                                        ) : (
                                                                            <button className="edit-profile follow" onClick={(e) => handleFollow(e, "FOLLOW")}>Follow</button>
                                                                        )}
                                                                    </>
                                                                )}
                                                        </div>
                                                        <div className="account-stats">
                                                            <p className="stat"><span>{numPosts}</span> posts</p>
                                                            <p className="stat"><span>{numFollowers}</span> followers</p>
                                                            <p className="stat"><span>{numFollowing}</span> following</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="name">{name}</p>
                                                <p className="bio">{bio}</p>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="pick-content-container">
                                            <div className={`pick-content-btn ${showPosts ? 'chosen' : ''}`} onClick={() => setShowPosts(true)}>
                                                <MdOutlineGridOn />
                                            </div>
                                            {ownProfile && (
                                                <div className={`pick-content-btn ${showPosts ? '' : 'chosen'}`} onClick={() => setShowPosts(false)}>
                                                    <FaBookmark />
                                                </div>
                                            )}
                                        </div>
                                        <hr />
                                        {showPosts ? <Posts userId={userId} /> : <Saved />}
                                    </>
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
