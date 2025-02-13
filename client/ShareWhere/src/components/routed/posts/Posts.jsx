import "./posts.css";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import LocationModal from "../locationModal/LocationModal";

const Posts = () => {
    
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const navigate = useNavigate();


    function openLocationModal(post) {
        setSelectedPost(post);
        console.log(selectedPost);
        setShowModal(true);
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
                <div className="loading">Loading...</div>
            ) : (
                <>
                    <div className={`posts-container ${posts.length === 0 ? 'none' : ''}`}>
                        {posts.map((post) => (
                            <div key={post.locationId} className="post" onClick={() => {openLocationModal(post)}}>
                                {post.images && post.images.length > 0 && ( // Conditional rendering of the image
                                    <img src={`data:${post.images[0].imageType};base64,${post.images[0].imageData}`} alt="Post" />
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