import "./posts.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LocationModal from "../locationModal/LocationModal";
import UseAnimations from "react-useanimations";
import loading from 'react-useanimations/lib/loading';
import { IoBookmark  } from "react-icons/io5";
import PropTypes from "prop-types";

const Posts = ({ userId }) => {
    
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const openLocationModal  = async (pinId) => {
        const location_id = pinId;
        try {
            const response = await fetch(`${API_BASE_URL}/api/locations/${location_id}`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error fetching location:", response.status, errorData);
                return;
            }
            
            try {
                const pinData = await response.json(); // Extract the JSON data
                setSelectedPost(pinData);
                setShowModal(true);                              
            } catch (error) {
                console.error("Error parsing JSON:", error); // Handle JSON parsing errors
            }

        } catch (error) {
            console.error("Error loading location:", error);
        }
    }
    
    function closeLocationModal() {
        setShowModal(false);
    };

    function handleNavigate() {
        navigate("/add-location");
    };

    const loadPosts = async () => {
        setIsLoading(true);

        try {
            // const user_id = localStorage.getItem("userId");
            const response = await fetch(`${API_BASE_URL}/api/users/${userId}/posts`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error fetching user:", response.status, errorData);
                return;
            }
            
            try {
                const data = await response.json(); // Extract the JSON data 
                setPosts(data.reverse());
                                
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
        loadPosts();
    }, [showModal]);

    const handleModalOpened = (action) => {
        if (action === true) {
            document.body.classList.add("hidden");
        }
        else {
            document.body.classList.remove("hidden");
        }
    };

    return (

        <>
            {isLoading ? (
                <div className="loading"><UseAnimations animation={loading} size={56} /></div>
            ) : (
                <>
                    <div className={`posts-container ${posts.length === 0 ? 'none' : ''}`}>
                        {posts.map((post) => (
                            <div key={post.locationId} onClick={() => openLocationModal(post.locationId)} className="profile-post">
                                <div className="profile-post-poster">
                                    <img src={post.creatorProfilePic.imageUrl} />
                                    <p>{post.creatorUsername}</p>
                                    <div></div>
                                </div>
                                <img src={post.previewImage.imageUrl} className="profile-post-img"></img>
                                <div className="profile-post-info">
                                    <p className="profile-post-name">{post.locationName}</p>
                                    <p className="profile-post-city">{post.city}</p>
                                    <p className="profile-post-saves"><IoBookmark/>{post.saves}</p>
                                </div>
                            </div>
                        ))}
                        {posts.length === 0 && (
                            <div className="no-posts-container">
                                <p className="no-posts">No posts yet</p>
                                <img onClick={handleNavigate} src="/assets/images/tumbleweed.gif"></img>
                            </div>
                        )}
                    </div>

                    
                    {showModal && (
                            <LocationModal
                                handleModalOpened={handleModalOpened}
                                selectedPost={selectedPost}
                                closeLocationModal={closeLocationModal}
                            />
                    )}
                </>
            )}
        </>
    );
};

Posts.propTypes = {
    post: PropTypes.shape({
        locationId: PropTypes.number,
        creatorProfilePic: PropTypes.shape({
            imageUrl: PropTypes.string,
            }),
        previewImage: PropTypes.shape({
            imageUrl: PropTypes.string,
            }),
        locationName: PropTypes.string,
        creatorUsername: PropTypes.string,
        city: PropTypes.string,
        images: PropTypes.arrayOf(PropTypes.object), 
        likedBy: PropTypes.arrayOf(PropTypes.number),
        saves: PropTypes.number,
    }),
}

export default Posts;