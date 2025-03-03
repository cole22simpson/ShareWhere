import "./locationModal.css";
import PropTypes from "prop-types";
import CommentSection from "../commentSection/CommentSection";
import { useState, useEffect } from "react";
import { MdLocationPin, MdClose } from "react-icons/md";
import { RiArrowLeftCircleLine, RiArrowRightCircleLine } from "react-icons/ri";
import { IoBookmarkOutline, IoBookmark  } from "react-icons/io5";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from 'dayjs/plugin/updateLocale';
import useAuth from "../authContext/useAuth";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Map, AdvancedMarker, APIProvider} from "@vis.gl/react-google-maps";

dayjs.extend(relativeTime);

const LocationModal = ({ selectedPost, handleModalOpened, closeLocationModal }) => {
    
    const MAP_ID = import.meta.env.VITE_MAP_ID;
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;
    
    const createdAtDate = dayjs(selectedPost.createdAt);
    const timeAgo = createdAtDate.fromNow();
    const comments = selectedPost.comments;
    const locationId = selectedPost.locationId;
    const multipleImages = selectedPost.images.length > 1;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const locationTags = selectedPost.tags;
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();
    const [isMounted, setIsMounted] = useState(false);
    const [isSaved, setIsSaved] = useState(selectedPost.savedBy.includes(parseInt(localStorage.getItem("userId"))));
    const [numSaves, setNumSaves] = useState(selectedPost.saves);
    const [commentImageOpen, setCommentImageOpen] = useState(false);
    const userNameClass = getUsernameClass(selectedPost.creatorName);
    const { userLoggedIn, setUserLoggedIn } = useAuth();
    const [deletePost, setDeletePost] = useState(false);
    const ownedPost = selectedPost.createdByProfileID === parseInt(localStorage.getItem("userId"));
    const [zoomedOutMap, setZoomedOutMap] = useState(15);

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 700) {
                setZoomedOutMap(14);
            }
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    useEffect(() => {
        dayjs.extend(updateLocale);

        dayjs.updateLocale('en', {
            relativeTime: {
                future: "in %s",
                past: "%s",
                s: '%ds',
                m: "1m",
                mm: "%dm",
                h: "1h",
                hh: "%dh",
                d: "1d",
                dd: "%dd",
                M: "1mon",
                MM: "%dmon",
                y: "1y",
                yy: "%dy"
            }
        });
    }, []);
    
    useEffect(() => {
        setIsMounted(true);
    
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape' && isMounted) {
                if (commentImageOpen) {
                    event.stopPropagation();
                    setCommentImageOpen(false);
                } else {
                    closeLocationModal();
                    handleModalOpened(false);
                }
            }
        };
    
        window.addEventListener('keydown', handleEscapeKey);
    
        return () => {
            window.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isMounted, commentImageOpen]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.stopPropagation(); // Stop event from affecting post modal
                closeImage();
            }
        };

        if (selectedImage) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedImage]);

    const openImage = (imageUrl) => {
        setSelectedImage(imageUrl);
        setCommentImageOpen(true);
    };

    const closeImage = () => {
        setSelectedImage(null);
        setCommentImageOpen(false);
    };

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
        setCurrentImageIndex((prevIndex) =>
            (prevIndex + 1) % selectedPost.images.length 
        );
    };

    const handlePrevImage = () => {
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

    const getPinIcon = (pinType) => {
        switch (pinType) {
            case "VIEW":
                return "/assets/icons/sunset.svg";
            case "ROCKCLIMB":
                return "/assets/icons/rock-climb.svg";
            case "DATE":
                return "/assets/icons/date.svg";
            case "ART":
                return "/assets/icons/art.svg";
            case "BIKE":
                return "/assets/icons/bike.svg";
            case "BUILDING":
                return "/assets/icons/building.svg";
            case "PICTURES":
                return "/assets/icons/camera.svg";
            case "CAVE":
                return "/assets/icons/cave.svg";
            case "GRAFFITI":
                return "/assets/icons/graffiti.svg";
            case "HIKE":
                return "/assets/icons/hike.svg";
            case "NATURE":
                return "/assets/icons/nature.svg";
            case "SKATEBOARD":
                return "/assets/icons/skateboard.svg";
            case "STARGAZING":
                return "/assets/icons/star-gazing.svg";
            case "SWIM":
                return "/assets/icons/swim.svg";
            case "READING":
                return "/assets/icons/reading.svg";
            default:
                return "/assets/icons/default.svg";
        }
    }

    return (
        <div id="location-modal-container" className="location-modal-container">
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
                    <p className="created-at">{timeAgo}</p>
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
                        onClick={() => openImage(selectedPost.images[currentImageIndex].imageUrl)}
                    />
                    <div className={`img-arrow ${multipleImages ? '' : 'none'}`} onClick={handleNextImage}>
                        <RiArrowRightCircleLine/>
                    </div>
                </div>
                <hr/>
                {selectedPost.locationDescription.length > 0 && (
                    <p className="location-description"><span>{selectedPost.creatorName}</span>&nbsp;{selectedPost.locationDescription}</p>
                )}
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
                            zoom={zoomedOutMap}
                            minZoom={10}
                            center={{ lat: selectedPost.latitude, lng: selectedPost.longitude }}
                            gestureHandling={"greedy"}
                            disableDefaultUI={true}
                            mapTypeId={"terrain"}
                            mapId={MAP_ID}>
                            <AdvancedMarker position={{ lat: selectedPost.latitude, lng: selectedPost.longitude }}>
                                    <div className="modal-pin-icon-container">
                                        <img className="modal-pin-icon" src={"/assets/icons/marker.png"}/>
                                        <img className="modal-pin-type" src={getPinIcon(selectedPost.pinType)} />
                                    </div>
                            </AdvancedMarker>
                        </Map>
                    </APIProvider>
                </div>
                <CommentSection setCommentImageOpen={setCommentImageOpen} comments={comments} locationId={locationId} />
            </div>
            {selectedImage && (
                <div className="image-modal" onClick={closeImage}>
                    <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                        <p className="close-btn" onClick={closeImage}><MdClose /></p>
                        <img src={selectedImage} />
                    </div>
                </div>
            )}
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
        pinType: PropTypes.string.isRequired,
        longitude: PropTypes.number.isRequired,
        saves: PropTypes.number.isRequired,
        savedBy: PropTypes.arrayOf(PropTypes.number).isRequired,
        tags: PropTypes.arrayOf(PropTypes.object).isRequired, 
      }).isRequired,
    closeLocationModal: PropTypes.func,
    handleModalOpened: PropTypes.func,
}

export default LocationModal;