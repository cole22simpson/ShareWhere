import PropTypes from "prop-types";
import "./locationForm.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import TagSelector from "../tagSelector/TagSelector.jsx";
import ImageUploader from "../imageUploader/ImageUploader";
import AddLocMap from "../addLocMap/AddLocMap";
import PinSelector from "../pinSelector/PinSelector.jsx";
import UseAnimations from "react-useanimations";
import loading from 'react-useanimations/lib/loading';

const LocationForm = ({ initialLatitude, initialLongitude, tags, selectedTags, setSelectedTags, images, setImages }) => {
    const [rawName, setName] = useState("");
    const [rawDetails, setDetails] = useState("");
    const [pinType, setPinType] = useState("DEFAULT");
    const [latitude, setLatitude] = useState(initialLatitude);
    const [longitude, setLongitude] = useState(initialLongitude);
    const [submitted, setSubmitted] = useState(false);
    const GEOCODE_API_KEY = import.meta.env.VITE_GEOCODE_API;
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();
    const [isRearranged, setIsRearranged] = useState(false);

    useEffect(() => {
        function handleResize() {
            setIsRearranged(window.innerWidth < 850);
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setDisabled(
            submitted ||
            rawName === "" ||
            rawDetails === "" ||
            images.length === 0 ||
            Object.keys(selectedTags).length === 0
        );
    }, [submitted, rawName, rawDetails, images, selectedTags]);

    const handleCharCount = (e, maxLength) => `${e.target.value.length} / ${maxLength}`;

    const handleLocationChange = ({ lat, lng }) => {
        setLatitude(lat);
        setLongitude(lng);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        setSubmitted(true);

        let city = "";

        const name = rawName.trim();
        const details = rawDetails.trim();

        try {
            const response = await fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=${GEOCODE_API_KEY}`, {
                method: "GET"
            });
            if (response.ok) {
                const data = await response.json();
                city = data.address.city;
            }
        } catch (error) {
            console.error(error.message);
        }
    
        const selectedTagsArray = Object.values(selectedTags)
            .filter(tagName => tagName !== null);
    
        const userId = localStorage.getItem("userId");
    
        const formData = new FormData();
    
        formData.append("user_id", userId);
        formData.append("location_name", name);
        formData.append("location_description", details);
        formData.append("latitude", parseFloat(latitude));
        formData.append("longitude", parseFloat(longitude));
        formData.append("city", city);  // This should now have the correct value
        formData.append("pin_type", pinType);
        formData.append("tag_names", selectedTagsArray.join(","));
        images.forEach(image => {
            formData.append("image_files", image);
        });
    
        try {
            const response = await fetch("http://localhost:8080/locations/post", {
                method: "POST",
                body: formData,
                credentials: "include",
            });
    
            if (!response.ok) {
                setSubmitted(false);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            setTimeout(() => {
                navigate("/profile");
            }, 1500);
    
        } catch (error) {
            setSubmitted(false);
            console.error("Error submitting location:", error);
        }
    };

    return (
        <div className="addloc-container">
            {!isRearranged ? (
                <>
                    <div className="addloc-sidebar">
                        <div className="sidebar-section">
                            <label className="addloc-label top-label">Name your location</label>
                            <input
                                type="text"
                                className="addloc-input"
                                placeholder="Come up with something fun"
                                maxLength="80"
                                value={rawName}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <p className="char-count">{handleCharCount({ target: { value: rawName } }, 80)}</p>

                            <label className="addloc-label">Include some details</label>
                            <textarea
                                className="addloc-input big-input"
                                placeholder="You can include information like directions or tips"
                                maxLength="1200"
                                value={rawDetails}
                                onChange={(e) => setDetails(e.target.value)}
                            />
                            <p className="char-count">{handleCharCount({ target: { value: rawDetails } }, 1200)}</p>

                            <ImageUploader images={images} setImages={setImages} />
                            <TagSelector tags={tags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
                            <PinSelector pinType={pinType} setPinType={setPinType} />
                        </div>
                        <button
                            className="submit-location"
                            disabled={disabled}
                            onClick={handleSubmit}>
                                {submitted ? (
                                    <UseAnimations animation={loading} size={30} />
                                ) : (
                                    <p>Share Where</p>
                                )}
                        </button>
                    </div>
                    <AddLocMap initialLatitude={initialLatitude} initialLongitude={initialLongitude} latitude={latitude} longitude={longitude} onLocationChange={handleLocationChange} />
                </>
            ) : (
                <>
                    <div className="addloc-sidebar">
                        <div className="sidebar-section">
                            <div className="sidebar-left">
                                <label className="addloc-label top-label">Name your location</label>
                                <input
                                    type="text"
                                    className="addloc-input"
                                    placeholder="Come up with something fun"
                                    maxLength="80"
                                    value={rawName}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <p className="char-count">{handleCharCount({ target: { value: rawName } }, 80)}</p>

                                <label className="addloc-label">Include some details</label>
                                <textarea
                                    className="addloc-input big-input"
                                    placeholder="You can include information like directions or tips"
                                    maxLength="1200"
                                    value={rawDetails}
                                    onChange={(e) => setDetails(e.target.value)}
                                />
                                <p className="char-count">{handleCharCount({ target: { value: rawDetails } }, 1200)}</p>
                            </div>
                            <div className="sidebar-middle">
                                <TagSelector tags={tags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
                            </div>
                            <div className="sidebar-right">
                                <ImageUploader images={images} setImages={setImages} />
                                <PinSelector pinType={pinType} setPinType={setPinType} />
                            </div>
                        </div>
                    </div>
                    <div className="addloc-vert-bottom">
                        <AddLocMap initialLatitude={initialLatitude} initialLongitude={initialLongitude} latitude={latitude} longitude={longitude} onLocationChange={handleLocationChange} />
                        <button
                                    className="submit-location"
                                    disabled={disabled}
                                    onClick={handleSubmit}>
                                        {submitted ? (
                                            <UseAnimations animation={loading} size={20} />
                                        ) : (
                                            <p>Share Where</p>
                                        )}
                        </button>
                    </div>
                </>
            )}
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