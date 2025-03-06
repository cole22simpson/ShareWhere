import "./posts.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LocationModal from "../locationModal/LocationModal";
import UseAnimations from "react-useanimations";
import loading from 'react-useanimations/lib/loading';
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
                            <div key={post.locationId} className="post" onClick={() => {openLocationModal(post.locationId)}}>
                                {post.previewImage && ( // Conditional rendering of the image
                                <img src={post.previewImage.imageUrl} alt="Post" />
                                )}
                                <p>{post.locationName}</p>
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
    userId: PropTypes.string.isRequired,
}

export default Posts;