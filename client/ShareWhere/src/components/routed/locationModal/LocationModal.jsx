import "./locationModal.css";
import PropTypes from "prop-types";
import { useState } from "react";
import { MdLocationPin, MdClose } from "react-icons/md";
import { RiArrowLeftCircleLine, RiArrowRightCircleLine } from "react-icons/ri";
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
                <p className="location-tags">Tags</p>
                <div className="location-tags-container">
                    {locationTags.map((tag, index) => (
                    <div key={index} className="location-tag">
                        {tag.tagName}
                    </div>
                    ))}
                </div>
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
                <p>Comments</p>
            </div>
        </div>
    );
};

LocationModal.propTypes = {
    selectedPin: PropTypes.shape({
        createdAt: PropTypes.string.isRequired,
        createdByProfileID: PropTypes.number.isRequired,
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