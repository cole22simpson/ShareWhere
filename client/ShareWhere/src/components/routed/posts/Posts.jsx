import "./posts.css";
import PropTypes from "prop-types";
import LocationModal from "../locationModal/LocationModal";

const Posts = ({ posts, openLocationModal, closeLocationModal, showModal, selectedPin }) => {

    return (

        <>
            <div className="posts-container">
                {posts.map((post) => (
                    <div key={post.locationId} className="post" onClick={() => {openLocationModal(post)}}>
                        {post.images && post.images.length > 0 && ( // Conditional rendering of the image
                            <img src={`data:${post.images[0].imageType};base64,${post.images[0].imageData}`} alt="Post" />
                        )}
                        <p>{post.locationName}</p>
                    </div>
                ))}
                {posts.length === 0 && (
                    <p>No posts yet.</p>
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

Posts.propTypes = {
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

export default Posts;