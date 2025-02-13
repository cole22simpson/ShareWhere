import "./saved.css";
import PropTypes from "prop-types";
import { useState } from "react";
import LocationModal from "../locationModal/LocationModal";

const Saved = () => {

    const [saved, setSaved] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPin, setSelectedPin] = useState(null);

    function openLocationModal(pin) {
        setSelectedPin(pin);
        console.log(selectedPin);
        setShowModal(true);
    }

    function closeLocationModal() {
        setShowModal(false);
    };

    return (

        <>
            <div className={`posts-container ${saved.length === 0 ? 'none' : ''}`}>
                {saved.map((post) => (
                    <div key={post.locationId} className="post" onClick={() => {openLocationModal(post)}}>
                        {post.images && post.images.length > 0 && ( // Conditional rendering of the image
                            <img src={`data:${post.images[0].imageType};base64,${post.images[0].imageData}`} alt="Post" />
                        )}
                        <p>{post.locationName}</p>
                    </div>
                ))}
                {saved.length === 0 && (
                    <div className="no-posts-container">
                        <p className="no-posts">No posts yet</p>
                        <img onClick={saved} src="/assets/images/tumbleweed.gif"></img>
                    </div>
                )}
            </div>
            {showModal && (
                    <LocationModal
                        selectedPin={selectedPin}
                        closeLocationModal={closeLocationModal}
                    />
            )}
        </>
    );
};

Saved.propTypes = {
    posts: PropTypes.arrayOf(
        PropTypes.shape({
        locationId: PropTypes.number.isRequired, 
        images: PropTypes.arrayOf(
            PropTypes.shape({
            imageType: PropTypes.string.isRequired,
            imageData: PropTypes.string.isRequired,
            })
        ),
        locationName: PropTypes.string.isRequired,
        })
    ).isRequired,
    openLocationModal: PropTypes.func.isRequired,
    closeLocationModal: PropTypes.func.isRequired,
    showModal: PropTypes.bool.isRequired,
    selectedPin: PropTypes.shape({
        createdAt: PropTypes.string.isRequired,
        createdByProfileID: PropTypes.number.isRequired,
        comments: PropTypes.arrayOf(PropTypes.object).isRequired,
        creatorName: PropTypes.string.isRequired,
        creatorProfilePic: PropTypes.object.isRequired,
        images: PropTypes.arrayOf(PropTypes.object).isRequired, 
        latitude: PropTypes.number.isRequired,
        locationDescription: PropTypes.string.isRequired,
        locationId: PropTypes.number.isRequired,
        locationName: PropTypes.string.isRequired,
        longitude: PropTypes.number.isRequired,
        saves: PropTypes.number.isRequired,
        tags: PropTypes.arrayOf(PropTypes.object).isRequired, 
    }).isRequired,
  };

export default Saved;