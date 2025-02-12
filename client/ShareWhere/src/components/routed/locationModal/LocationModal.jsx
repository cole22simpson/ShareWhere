import "./locationModal.css";
import PropTypes from "prop-types";
import Comment from "../comment/Comment";
import { useState, useEffect } from "react";
import { MdLocationPin, MdClose, MdAddAPhoto } from "react-icons/md";
import { RiArrowLeftCircleLine, RiArrowRightCircleLine } from "react-icons/ri";
import { BsArrowUpCircleFill } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";
import { FaBookmark } from 'react-icons/fa';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { Map, AdvancedMarker, APIProvider} from "@vis.gl/react-google-maps";

dayjs.extend(relativeTime);

const LocationModal = ({ selectedPin, closeLocationModal }) => {
    const API_KEY = "AIzaSyA3qoBRglmsQ2nyxvGWJ8SCI0az2PCL-bE";
    const MAP_ID = "8556750882f0b69f";

    const createdAtDate = dayjs(selectedPin.createdAt);
    const timeAgo = createdAtDate.fromNow();
    const multipleImages = selectedPin.images.length > 1;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const locationTags = selectedPin.tags;
    const [locationComments, setLocationComments] = useState(selectedPin.comments);
    const [commentText, setCommentText] = useState("");
    const [commentImages, setCommentImages] = useState([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        const handleEscapeKey = (event) => {
            if (event.key === 'Escape' && isMounted) {
            closeLocationModal(); 
            }
        };

        window.addEventListener('keydown', handleEscapeKey);

        return () => {
            window.removeEventListener('keydown', handleEscapeKey);
        };
    }, [closeLocationModal, isMounted]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (commentImages.length + files.length > 5) {
            alert("You can only upload up to 5 photos.");
            return;
        }
        setCommentImages((prev) => [...prev, ...files]);
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex + 1) % selectedPin.images.length 
        );
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex - 1 + selectedPin.images.length) % selectedPin.images.length 
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();

        const userId = localStorage.getItem("userId");
        const locationId = selectedPin.locationId;

        formData.append("userId", userId);
        formData.append("locationId", locationId);
        formData.append("commentText", commentText);
        commentImages.forEach(image => {
            formData.append("imageFiles", image);
        });

        try {
            const response = await fetch("http://localhost:8080/comments/send", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const newComment = await response.json();
            setLocationComments([...locationComments, newComment]);
            setCommentText("");
            setCommentImages([]);

        } catch (error) {
            console.error("Error submitting location:", error);
        }
    };

    return (
        <div className="location-modal-container">
            <div className="info-container">
                <div className="back-btn-container">
                    <button className="back-to-map" onClick={closeLocationModal}><MdClose/></button>
                </div>
                <div className="top-row">
                    <div className="creator-info">
                        <img className="creator-profile-pic" src={`data:${selectedPin.creatorProfilePic.imageType};base64,${selectedPin.creatorProfilePic.imageData}`}></img>
                        <p className="creator-name">{selectedPin.creatorName}</p>
                    </div>
                    <p className="created-at">Posted {timeAgo}</p>
                </div>
                <p className="location-name">{selectedPin.locationName}</p>
                <p className="saves"><FaBookmark /><span>&nbsp;{selectedPin.saves}</span></p>
                <hr/>
                <div className="location-images">
                    <div className={`img-arrow ${multipleImages ? '' : 'none'}`} onClick={handlePrevImage}>
                        <RiArrowLeftCircleLine/>
                    </div>
                    <img 
                        src={`data:${selectedPin.images[currentImageIndex].imageType};base64,${selectedPin.images[currentImageIndex].imageData}`} 
                        alt={`Image ${currentImageIndex + 1} of ${selectedPin.locationName}`} 
                    />
                    <div className={`img-arrow ${multipleImages ? '' : 'none'}`} onClick={handleNextImage}>
                        <RiArrowRightCircleLine/>
                    </div>
                </div>
                <hr/>
                <p className="location-description"><span>{selectedPin.creatorName}</span>&nbsp;{selectedPin.locationDescription}</p>
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
                            defaultCenter={{ lat: selectedPin.latitude, lng: selectedPin.longitude }}
                            gestureHandling={"greedy"}
                            disableDefaultUI={true}
                            mapTypeId={"terrain"}
                            mapId={MAP_ID}>
                            <AdvancedMarker position={{ lat: selectedPin.latitude, lng: selectedPin.longitude }}>
                                <MdLocationPin size={40} />
                            </AdvancedMarker>
                        </Map>
                    </APIProvider>
                </div>
                <div className="comments-container">
                    <p className="location-header">Comments</p>
                    <hr/>
                    {locationComments.length === 0 ? (
                        <div className="no-comments">
                            <p>No comments yet</p>
                        </div>
                    ) : (
                        <div className="comments">
                            {locationComments.map((comment) => (
                                <Comment key={comment.commentId} comment={comment} />
                            ))}
                        </div>
                    )}
                    <div className="add-comment-container">
                        <div className="comment-top-row">
                            <textarea
                                type="text"
                                className="comment-input"
                                placeholder="Write a comment"
                                maxLength="800"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <input
                                id="comment-image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                multiple
                                hidden
                            />
                            <div className="upload-and-send">
                                <div className="upload-btn-container">
                                    <label className="comment-image-button" htmlFor="comment-image-upload"><MdAddAPhoto /></label>
                                    <p className="photo-count">{commentImages.length} / 5</p>
                                </div>
                                <div className="send-btn">
                                    <button className="submit-comment" onClick={handleSubmit}><IoSendSharp/></button>
                                </div>
                            </div>
                        </div>
                        <div className="uploaded-images"> 
                            {commentImages.map((image, index) => (
                                <img 
                                    key={index} 
                                    src={URL.createObjectURL(image)} 
                                    alt={`Uploaded Image ${index + 1}`} 
                                    className="uploaded-image" 
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

LocationModal.propTypes = {
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
    closeLocationModal: PropTypes.func.isRequired
}

export default LocationModal;