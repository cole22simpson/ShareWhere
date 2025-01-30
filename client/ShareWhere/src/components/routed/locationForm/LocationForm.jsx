import PropTypes from "prop-types";
import "./locationForm.css";
import { useState } from "react";
import TagSelector from "../tagSelector/TagSelector.jsx";
import ImageUploader from "../imageUploader/ImageUploader";
import AddLocMap from "../addLocMap/AddLocMap";

const LocationForm = ({ latitude, longitude, tags, selectedTags, setSelectedTags, images, setImages }) => {
    const [name, setName] = useState("");
    const [details, setDetails] = useState("");

    const handleCharCount = (e, maxLength) => `${e.target.value.length} / ${maxLength}`;

    return (
        <div className="addloc-container">
            <div className="addloc-sidebar">
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

                <TagSelector tags={tags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
                <ImageUploader images={images} setImages={setImages} />
            </div>
            <AddLocMap latitude={latitude} longitude={longitude} />
        </div>
    );
};

LocationForm.propTypes = {
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    tags: PropTypes.object.isRequired,
    selectedTags: PropTypes.object.isRequired,
    setSelectedTags: PropTypes.func.isRequired,
    images: PropTypes.array.isRequired,
    setImages: PropTypes.func.isRequired,
};

export default LocationForm;