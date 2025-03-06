import { useState } from "react";
import LocationModal from "../locationModal/LocationModal";
import { IoBookmark  } from "react-icons/io5";
import "./homePost.css";
import PropTypes from "prop-types";

const HomePost = ({ post, handleModalOpened, setModalOpened }) => {

    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const API_BASE_URL = import.meta.env.VITE_API_URL;

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
                handleModalOpened(true);  
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
        handleModalOpened(false);
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
                    <p className="home-post-name">{post.locationName}</p>
                    <p className="home-post-city">{post.city}</p>
                    <p className="home-post-saves"><IoBookmark/>{post.saves}</p>
                </div>
            </div>

            {showModal && (
                    <LocationModal
                        selectedPost={selectedPost}
                        closeLocationModal={closeLocationModal}
                        handleModalOpened={handleModalOpened}
                    />
            )}
        </>
    );
};

HomePost.propTypes = {
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
    setModalOpened: PropTypes.func,
    handleModalOpened: PropTypes.func,
}

export default HomePost;