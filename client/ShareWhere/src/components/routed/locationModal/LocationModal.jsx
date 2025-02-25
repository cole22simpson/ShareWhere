import "./locationModal.css";
import PropTypes from "prop-types";
import CommentSection from "../commentSection/CommentSection";
import { useState, useEffect } from "react";
import { MdLocationPin, MdClose } from "react-icons/md";
import { RiArrowLeftCircleLine, RiArrowRightCircleLine } from "react-icons/ri";
import { IoBookmarkOutline, IoBookmark  } from "react-icons/io5";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import useAuth from "../authContext/useAuth";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Map, AdvancedMarker, APIProvider} from "@vis.gl/react-google-maps";

dayjs.extend(relativeTime);

const LocationModal = ({ selectedPost, handleModalOpened, closeLocationModal }) => {
    const MAP_ID = import.meta.env.VITE_MAP_ID;
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;
    
    const createdAtDate = dayjs(selectedPost.createdAt);
    const comments = selectedPost.comments;
    const locationId = selectedPost.locationId;
    const timeAgo = createdAtDate.fromNow();
    const multipleImages = selectedPost.images.length > 1;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const locationTags = selectedPost.tags;
    const navigate = useNavigate();
    const [isMounted, setIsMounted] = useState(false);
    const [isSaved, setIsSaved] = useState(selectedPost.savedBy.includes(parseInt(localStorage.getItem("userId"))));
    const [numSaves, setNumSaves] = useState(selectedPost.saves);
    const [commentImageOpen, setCommentImageOpen] = useState(false);
    const userNameClass = getUsernameClass(selectedPost.creatorName);
    const { userLoggedIn, setUserLoggedIn } = useAuth();
    const [deletePost, setDeletePost] = useState(false);
    const ownedPost = selectedPost.createdByProfileID === parseInt(localStorage.getItem("userId"));

    useEffect(() => {
        setIsMounted(true);
    
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape' && isMounted) {
                if (commentImageOpen) {
                    event.stopPropagation(); // Prevent post modal from closing
                    setCommentImageOpen(false); // Close only the image modal
                } else {
                    closeLocationModal(); // Close the post modal if no image is open
                    handleModalOpened(false);
                }
            }
        };
    
        window.addEventListener('keydown', handleEscapeKey);
    
        return () => {
            window.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isMounted, commentImageOpen]);

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

    const handleNextImage = () => {
        console.log("NEXT");
        setCurrentImageIndex((prevIndex) =>
            (prevIndex + 1) % selectedPost.images.length 
        );
    };

    const handlePrevImage = () => {
        console.log("PREV");
        setCurrentImageIndex((prevIndex) =>
            (prevIndex - 1 + selectedPost.images.length) % selectedPost.images.length 
        );
    };

    const handleProfileClick = (user_id) => {
        if (!userLoggedIn) {
            navigate("/login");
        }
        else {
            navigate(`/profile/${user_id}`);
        }
    }

    const handleDeletePost = async (event, postId) => {
        event.preventDefault();

        try {
            const response = await fetch(`http://localhost:8080/locations/${postId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (response.ok) {
                closeLocationModal();
                if (window.location.pathname === "/") {
                    window.location.reload();
                }
            }
            else {
                console.error("Delete location failed: ", await response.text());
            }
        } catch (error) {
            console.error("Error during delete: ", error);
        }
    }

    const handleSave = async (event, action) => {
        event.preventDefault();

        if (!userLoggedIn) {
            navigate("/login");
        }

        const type = action;

        const userId = localStorage.getItem("userId");

        const formData = new FormData();

        formData.append("user_id", userId);
        formData.append("location_id", locationId);
        formData.append("field", type);

        try {
            const response = await fetch(`http://localhost:8080/users/save`, {
                method: "PATCH",
                credentials: "include",
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setIsSaved(!isSaved);
                setNumSaves(data.length);
            }
            else {
                console.error("Save update failed: ", await response.text());
            }
        } catch (error) {
            console.error("Error during save update: ", error);
        }
    }

    const handleCloseModal = () => {
        closeLocationModal();
        handleModalOpened(false);
    };

    return (
        <div className="location-modal-container">
            <div className="info-container">
                <div className="back-btn-container">
                    {deletePost && (
                        <div className="delete-post-container">
                            <div onClick={(e) => handleDeletePost(e, selectedPost.locationId)}  className="delete-post">
                                Delete Post
                            </div>
                        </div>
                    )}
                    <button onClick={() => setDeletePost(!deletePost)} disabled={!ownedPost} className="delete-comment">
                        {ownedPost ? (
                            <BsThreeDots className="dots" />
                        ) : (
                            <div className="delete-comment" />
                        )}
                    </button>
                    <button className="back-to-map" onClick={handleCloseModal}><MdClose/></button>
                </div>
                <div className="top-row">
                    <div className="creator-info">
                        <img className="creator-profile-pic" src={selectedPost.creatorProfilePic.imageUrl}></img>
                        <p className={`creator-name ${userNameClass}`} onClick={() => handleProfileClick(selectedPost.createdByProfileID)}>{selectedPost.creatorName}</p>
                    </div>
                    <p className="created-at">Posted {timeAgo}</p>
                </div>
                <p className="location-name">{selectedPost.locationName}</p>
                <p className="location-city">{selectedPost.city}</p>
                <p className="saves">
                    {!isSaved ? (
                        <button onClick={(e) => {handleSave(e, "SAVE")}} className="save-btn"><IoBookmarkOutline /></button>
                    ) : (
                        <button onClick={(e) => {handleSave(e, "UNSAVE")}} className="unsave-btn"><IoBookmark /></button>
                    )}
                    <span>&nbsp;{numSaves}</span>
                </p>
                <hr/>
                <div className="location-images">
                    <div className={`img-arrow ${multipleImages ? '' : 'none'}`} onClick={handlePrevImage}>
                        <RiArrowLeftCircleLine/>
                    </div>
                    <img 
                        src={selectedPost.images[currentImageIndex].imageUrl} 
                        alt={`Image ${currentImageIndex + 1} of ${selectedPost.locationName}`} 
                    />
                    <div className={`img-arrow ${multipleImages ? '' : 'none'}`} onClick={handleNextImage}>
                        <RiArrowRightCircleLine/>
                    </div>
                </div>
                <hr/>
                <p className="location-description"><span>{selectedPost.creatorName}</span>&nbsp;{selectedPost.locationDescription}</p>
                <p className="location-header">Tags</p>
                <div className="location-tags-container">
                    {locationTags.map((tag, index) => (
                    <div key={index} className="location-tag">
                        {tag.tagName}
                    </div>
                    ))}
                </div>
                <p className="location-header">Location</p>
                <div className="modal-map-container">
                    <APIProvider
                        apiKey={API_KEY}
                        solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
                    >
                        <Map
                            defaultZoom={15}
                            defaultCenter={{ lat: selectedPost.latitude, lng: selectedPost.longitude }}
                            gestureHandling={"greedy"}
                            disableDefaultUI={true}
                            mapTypeId={"terrain"}
                            mapId={MAP_ID}>
                            <AdvancedMarker position={{ lat: selectedPost.latitude, lng: selectedPost.longitude }}>
                                <MdLocationPin size={40} />
                            </AdvancedMarker>
                        </Map>
                    </APIProvider>
                </div>
                <CommentSection setCommentImageOpen={setCommentImageOpen} comments={comments} locationId={locationId} />
            </div>
        </div>
    );
};

LocationModal.propTypes = {
    selectedPost: PropTypes.shape({
        createdAt: PropTypes.string.isRequired,
        createdByProfileID: PropTypes.number.isRequired,
        comments: PropTypes.arrayOf(PropTypes.object).isRequired,
        city: PropTypes.string.isRequired,
        creatorName: PropTypes.string.isRequired,
        creatorProfilePic: PropTypes.object.isRequired,
        images: PropTypes.arrayOf(PropTypes.object).isRequired, 
        latitude: PropTypes.number.isRequired,
        locationDescription: PropTypes.string.isRequired,
        locationId: PropTypes.number.isRequired,
        locationName: PropTypes.string.isRequired,
        longitude: PropTypes.number.isRequired,
        saves: PropTypes.number.isRequired,
        savedBy: PropTypes.arrayOf(PropTypes.number).isRequired,
        tags: PropTypes.arrayOf(PropTypes.object).isRequired, 
      }).isRequired,
    closeLocationModal: PropTypes.func,
    handleModalOpened: PropTypes.func,
}

export default LocationModal;