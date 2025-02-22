import { useState } from "react";
import LocationModal from "../locationModal/LocationModal";
import { IoBookmark  } from "react-icons/io5";
import "./homePost.css";
import PropTypes from "prop-types";

const HomePost = ({ post, setModalOpened }) => {

    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

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
                setModalOpened(true);                            
            } catch (error) {
                console.error("Error parsing JSON:", error); // Handle JSON parsing errors
            }

        } catch (error) {
            console.error("Error loading location:", error);
        }
    }
    
    function closeLocationModal() {
        setShowModal(false);
        setModalOpened(false);
    };

    return (
        <>
            <div onClick={() => openLocationModal(post.locationId)} className="home-post">
                <div className="home-post-poster">
                    <img src={post.creatorProfilePic.imageUrl} />
                    <p>{post.creatorUsername}</p>
                    <div></div>
                </div>
                <img src={post.previewImage.imageUrl} className="home-post-img"></img>
                <div className="home-post-info">
                    <div className="home-post-data">
                        <p className="home-post-name">{post.locationName}</p>
                        <p className="home-post-city">{post.city}</p>
                        <p className="home-post-saves"><IoBookmark/>{post.saves}</p>
                    </div>
                </div>
            </div>

            {showModal && (
                    <LocationModal
                        selectedPost={selectedPost}
                        closeLocationModal={closeLocationModal}
                    />
            )}
        </>
    );
};

HomePost.propTypes = {
    post: PropTypes.shape({
        locationId: PropTypes.number.isRequired,
        creatorProfilePic: PropTypes.shape({
            imageUrl: PropTypes.string.isRequired,
            }).isRequired,
        previewImage: PropTypes.shape({
            imageUrl: PropTypes.string.isRequired,
            }).isRequired,
        locationName: PropTypes.string.isRequired,
        creatorUsername: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(PropTypes.object).isRequired, 
        likedBy: PropTypes.arrayOf(PropTypes.number).isRequired,
        saves: PropTypes.number.isRequired,
    }),
    setModalOpened: PropTypes.func
}

export default HomePost;