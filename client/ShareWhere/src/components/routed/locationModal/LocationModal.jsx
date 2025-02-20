import "./locationModal.css";
import PropTypes from "prop-types";
import CommentSection from "../commentSection/CommentSection";
import { useState, useEffect } from "react";
import { MdLocationPin, MdClose } from "react-icons/md";
import { RiArrowLeftCircleLine, RiArrowRightCircleLine } from "react-icons/ri";
import { IoBookmarkOutline, IoBookmark  } from "react-icons/io5";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { Map, AdvancedMarker, APIProvider} from "@vis.gl/react-google-maps";

dayjs.extend(relativeTime);

const LocationModal = ({ selectedPost, closeLocationModal }) => {
    const MAP_ID = import.meta.env.VITE_MAP_ID;
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;
    
    const createdAtDate = dayjs(selectedPost.createdAt);
    const comments = selectedPost.comments;
    const locationId = selectedPost.locationId;
    const timeAgo = createdAtDate.fromNow();
    const multipleImages = selectedPost.images.length > 1;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const locationTags = selectedPost.tags;
    const [isMounted, setIsMounted] = useState(false);
    const [isSaved, setIsSaved] = useState(selectedPost.savedBy.includes(parseInt(localStorage.getItem("userId"))));
    const [numSaves, setNumSaves] = useState(selectedPost.saves);

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

    const handleSave = async (event, action) => {
        event.preventDefault();
        const type = action;

        const userId = localStorage.getItem("userId");

        const formData = new FormData();

        formData.append("userId", userId);
        formData.append("locationId", locationId);
        formData.append("field", type);

        try {
            const response = await fetch(`http://localhost:8080/users/save`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                },
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

    return (
        <div className="location-modal-container">
            <div className="info-container">
                <div className="back-btn-container">
                    <button className="back-to-map" onClick={closeLocationModal}><MdClose/></button>
                </div>
                <div className="top-row">
                    <div className="creator-info">
                        <img className="creator-profile-pic" src={selectedPost.creatorProfilePic.imageUrl}></img>
                        <p className="creator-name">{selectedPost.creatorName}</p>
                    </div>
                    <p className="created-at">Posted {timeAgo}</p>
                </div>
                <p className="location-name">{selectedPost.locationName}</p>
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
                <CommentSection comments={comments} locationId={locationId} />
            </div>
        </div>
    );
};

LocationModal.propTypes = {
    selectedPost: PropTypes.shape({
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
        savedBy: PropTypes.arrayOf(PropTypes.number).isRequired,
        tags: PropTypes.arrayOf(PropTypes.object).isRequired, 
      }).isRequired,
    closeLocationModal: PropTypes.func.isRequired
}

export default LocationModal;