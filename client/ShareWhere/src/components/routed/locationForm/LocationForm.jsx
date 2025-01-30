import PropTypes from "prop-types";
import "./locationForm.css";
import { useState } from "react";
import TagSelector from "../tagSelector/TagSelector.jsx";
import ImageUploader from "../imageUploader/ImageUploader";
import AddLocMap from "../addLocMap/AddLocMap";

const LocationForm = ({ initialLatitude, initialLongitude, tags, selectedTags, setSelectedTags, images, setImages }) => {
    const [name, setName] = useState("");
    const [details, setDetails] = useState("");
    const [latitude, setLatitude] = useState(initialLatitude);
    const [longitude, setLongitude] = useState(initialLongitude);

    const handleCharCount = (e, maxLength) => `${e.target.value.length} / ${maxLength}`;

    const handleLocationChange = ({ lat, lng }) => {
        setLatitude(lat);
        setLongitude(lng);
    };

    const handleSubmit = () => {
        console.log("Form Submitted:", { name, details, latitude, longitude, selectedTags, images });
    };

    return (
        <div className="addloc-container">
            <div className="addloc-sidebar">
                <div className="sidebar-section">
                    <label className="addloc-label">Name your location</label>
                    <input
                        type="text"
                        className="addloc-input"
                        placeholder="Come up with something fun"
                        maxLength="80"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <p className="char-count">{handleCharCount({ target: { value: name } }, 80)}</p>

                    <label className="addloc-label">Include some details</label>
                    <textarea
                        className="addloc-input big-input"
                        placeholder="You can include information like directions or tips"
                        maxLength="1200"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                    />
                    <p className="char-count">{handleCharCount({ target: { value: details } }, 1200)}</p>

                    <ImageUploader images={images} setImages={setImages} />
                    <TagSelector tags={tags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
                </div>
                <button className="submit-location" onClick={handleSubmit}>Create post</button>
            </div>
            <AddLocMap latitude={latitude} longitude={longitude} onLocationChange={handleLocationChange} />
        </div>
    );
};

LocationForm.propTypes = {
    initialLatitude: PropTypes.number.isRequired,
    initialLongitude: PropTypes.number.isRequired,
    tags: PropTypes.object.isRequired,
    selectedTags: PropTypes.object.isRequired,
    setSelectedTags: PropTypes.func.isRequired,
    images: PropTypes.array.isRequired,
    setImages: PropTypes.func.isRequired,
};

export default LocationForm;