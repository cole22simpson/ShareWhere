import "./posts.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LocationModal from "../locationModal/LocationModal";
import PropTypes from "prop-types";
import UseAnimations from "react-useanimations";
import loading from 'react-useanimations/lib/loading';

const Posts = () => {
    
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const navigate = useNavigate();

    const openLocationModal  = async (pinId) => {
        const locationId = pinId;
        try {
            const response = await fetch(`http://localhost:8080/locations/${locationId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
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
            const userId = localStorage.getItem("userId");
            const response = await fetch(`http://localhost:8080/users/${userId}/posts`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
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
                                selectedPost={selectedPost}
                                closeLocationModal={closeLocationModal}
                            />
                    )}
                </>
            )}
        </>
    );
};

export default Posts;