import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { TbMapCog } from "react-icons/tb";
import { MdClose } from "react-icons/md";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { ImPlus, ImMinus } from "react-icons/im";
import { IoBookmark  } from "react-icons/io5";
import { BsPersonArmsUp, BsPersonRaisedHand } from "react-icons/bs";
import { GiHandOk } from "react-icons/gi";
import "./discover.css";
import { Map, AdvancedMarker, useMap, useAdvancedMarkerRef, APIProvider, useMapsLibrary, MapControl, InfoWindow, ControlPosition } from "@vis.gl/react-google-maps";
import LocationModal from "../locationModal/LocationModal";

const Discover = () => {
    const userCoords = JSON.parse(localStorage.getItem("coords"));
    const defaultCenter = {lat: userCoords.lat, lng: userCoords.lng};
    const [center, setCenter] = useState({ lat: defaultCenter.lat, lng: defaultCenter.lng });
    const [mapRef, setMapRef] = useState(null);
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [showModal, setShowModal] = useState(false);
    const [controlsModal, setControlsModal] = useState(false);
    const [mapType, setMapType] = useState("terrain");
    const [pins, setPins] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [infoWindowOpen, setInfoWindowOpen] = useState(false);
    const markerRefs = useRef({});
    const [tags, setTags] = useState([]);
    const [mapLoading, setMapLoading] = useState(true);
    const [selectedPin, setSelectedPin] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [bounds, setBounds] = useState({ north: 0.0, south: 0.0, east: 0.0, west: 0.0 });
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [shrinkTags, setShrinkTags] = useState(false);
    const [littleGuySize, setLittleGuySize] = useState(window.innerWidth < 350 ? 30 : 40);
    const MAP_ID = import.meta.env.VITE_MAP_ID;
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;
    const [isStreetView, setIsStreetView] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [isRearranged, setIsRearranged] = useState(false);
    const triggerElementRef = useRef(null); 
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const handleModalOpened = (action) => {
        if (action === true) {
            document.body.classList.add("hidden");
        }
        else {
            document.body.classList.remove("hidden");
        }
    };

    const pinOptions = [
        "DEFAULT",
        "VIEW",
        "ROCKCLIMB",
        "DATE",
        "ART",
        "BIKE",
        "BUILDING",
        "PICTURES",
        "CAVE",
        "GRAFFITI",
        "HIKE",
        "NATURE",
        "SKATEBOARD",
        "STARGAZING",
        "SWIM",
        "READING"
    ];

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

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleLocationChange = ({ lat, lng }) => {
        setCenter({ lat: lat, lng: lng });
    };

    const handleResultClick = (pin) => {
        setCenter({ lat: pin.latitude, lng: pin.longitude });
        handleMarkerClick(pin);
    };

    useEffect(() => {
        function handleResize() {
            setLittleGuySize(window.innerWidth < 350 ? 30 : 40);
        }
    
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    

    useEffect(() => {
        function handleResize() {
            setShrinkTags(window.innerWidth < 1500);
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        function handleResize() {
            setIsRearranged(window.innerWidth < 850);
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/tags`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!response.ok) throw new Error("Failed to fetch tags");

                const data = await response.json();
                const groupedTags = data.reduce((acc, tag) => {
                    if (!acc[tag.tagGroup]) acc[tag.tagGroup] = [];
                    acc[tag.tagGroup].push(tag);
                    return acc;
                }, {});

                setTags(groupedTags);
            } catch (error) {
                console.error("Error fetching tags: ", error);
            }
        };

        fetchTags();
    }, []);

    const openLocationModal  = async (pinId, event) => {
        event.currentTarget.blur();

        const location_id = pinId;
        try {
            const response = await fetch(`${API_BASE_URL}/api/locations/${location_id}`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error fetching location:", response.status, errorData);
                return;
            }
            
            try {
                const pinData = await response.json(); // Extract the JSON data
                setSelectedPost(pinData);
                setShowModal(true);                              
            } catch (error) {
                console.error("Error parsing JSON:", error); // Handle JSON parsing errors
            }

        } catch (error) {
            console.error("Error loading location:", error);
        }
    }

    function closeLocationModal() {
        setShowModal(false);
    };

    useEffect(() => {
        if (showModal) {
          document.getElementById("location-modal-container").focus();
        }
      }, [showModal]);

    const handleMapLoad = (map) => {
        setMapRef(map);
        handleBoundsChanged();
    };

    const handleMarkerClick = (pin) => {
        setSelectedPin(pin);
        setInfoWindowOpen(true);
    };

    const handlePinIconMouseOver = (pin) => {
        setSelectedPin(pin);
        setInfoWindowOpen(true);
    };

    const handlePinIconMouseOut = () => {
        setInfoWindowOpen(false);
    };

    const handleIdle = (map) => {
        handleMapLoad(map);
        setDragging(false);
        loadPins();
    }

    const handleMapTypeChange = (type) => {
        switch (type) {
            case "terrain":
                setMapType("terrain");
                break;
            case "roadmap":
                setMapType("roadmap");
                break;
            case "satellite":
                setMapType("satellite");
                break;
            case "hybrid":
                setMapType("hybrid");
                break;
            default:
                setMapType("terrain");
        }
    };


    const handleCloseInfoWindow = () => {
        setInfoWindowOpen(false);
        setSelectedPin(null); // Clear the selected pin when the info window is closed
    };

    const handleBoundsChanged = () => {
        if (mapRef) {
            const mapBounds = mapRef.map.getBounds();
            const north = mapBounds.fi.hi;
            const south = mapBounds.fi.lo;
            const east = mapBounds.Gh.lo;
            const west = mapBounds.Gh.hi;
            setBounds({ north: north, south: south, east: east, west: west });
            
            const newLat = mapRef.map.center.lat();
            const newLng = mapRef.map.center.lng();
            setCenter({ lat: newLat, lng: newLng });
            handleLocationChange({ lat: newLat, lng: newLng});
        }
    };

    

    const loadPins = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/locations/pins?north=${bounds.north}&south=${bounds.south}&east=${bounds.east}&west=${bounds.west}`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error fetching user:", response.status, errorData);
                return;
            }
            
            try {
                const locationData = await response.json(); // Extract the JSON data
                setPins(locationData);
                setMapLoading(false);                               
            } catch (error) {
                console.error("Error parsing JSON:", error); // Handle JSON parsing errors
            }

        } catch (error) {
            console.error("Error loading user:", error);
        }
    };

    useEffect(() => {
        loadPins();
    }, [showModal]);

    useEffect(() => {
        if (bounds.north !== 0 && bounds.south !== 0 && bounds.east !== 0 && bounds.west !== 0) {
            loadPins();
        }
    }, [bounds]);

    const toggleTagSelection = (tagGroup, tagName) => {
        setSelectedTags((prev) => ({
            ...prev,
            [tagGroup]: prev[tagGroup] === tagName ? null : tagName,
        }));
    };

    const [activePinTypes, setActivePinTypes] = useState(
        pinOptions.reduce((acc, type) => ({ ...acc, [type]: true }), {}) // Initialize all pin types as active
    );

    const togglePinType = (type) => {
        setActivePinTypes((prev) => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const filteredPins = pins.filter((pin) => {
        if (!activePinTypes[pin.pinType]) return false;
    
        const activeTags = Object.values(selectedTags).filter(Boolean);
        if (activeTags.length > 0) {
            const pinTagNames = pin.tags.map((tag) => tag.tagName);
            return activeTags.every((selectedTag) => pinTagNames.includes(selectedTag));
        }
    
        if (searchQuery && !pin.locationName.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
    
        return true;
    });

    const searchResults = filteredPins.filter((pin) => 
        searchQuery && pin.locationName.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);

    return (
        <>      
            <APIProvider
                apiKey={API_KEY}
                solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
            >
                <div className="discover-container">
                    {!isRearranged ? (
                        <div className="search-sidebar">
                            <p className="discover-sidebar-header">Filter pins within map bounds</p>
                            <div className="search-name-container">
                                <label className="search-name-label">Filter by name</label>
                                <input
                                    id="search-name"
                                    className="search-by-name"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    autoComplete="off"
                                />
                                {searchQuery && (
                                    <div className="results-container">
                                        {filteredPins.length > 0 ? (
                                            <ul className="results">
                                            {filteredPins.map((pin) => (
                                                <li
                                                    key={pin.id}
                                                    className="location-result"
                                                    onClick={() => handleResultClick(pin)}
                                                >
                                                    <img className="location-result-image" src={pin.previewImage.imageUrl} alt="Location Image" />
                                                    <div className="location-result-info">
                                                        <p className="user-result-username">{pin.locationName}</p>
                                                        <p className="user-result-name">{pin.city}</p>
                                                    </div>
                                                </li>
                                            ))}
                                            </ul>
                                        ) : (
                                            <div className="results">
                                                <p className="result">No matches found.</p>
                                            </div> 
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="disc-filter-icon">
                                <p className="search-name-label">Filter by icon type</p>
                                <div className="disc-options-container">
                                    {pinOptions.map((option) => (
                                        <div
                                            className={`disc-pin-option ${activePinTypes[option] ? "selected" : ""}`} 
                                            key={option} 
                                            onClick={() => togglePinType(option)}
                                        >
                                            <img className="disc-pin-img" src={getPinIcon(option)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="disc-tags-container">
                                <p className="search-name-label">Filter by tags</p>
                                <>
                                    {!shrinkTags ? (
                                        <>
                                            {Object.entries(tags).map(([group, groupTags]) => (
                                                <div key={group} className="disc-tag-group">
                                                    {groupTags.map((tag) => (
                                                        <button
                                                            key={tag.tagId}
                                                            className={`disc-tag-btn ${selectedTags[group] === tag.tagName ? "selected" : ""}`}
                                                            onClick={() => toggleTagSelection(group, tag.tagName)}
                                                        >
                                                            {tag.tagName}
                                                        </button>
                                                    ))}
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            {Object.entries(tags)
                                                .flatMap(([group, groupTags]) =>
                                                    groupTags.map((tag) => ({ ...tag, group }))
                                                )
                                                .map((tag) => (
                                                    <button
                                                        key={tag.tagId}
                                                        className={`disc-tag-btn ${selectedTags[tag.group] === tag.tagName ? "selected" : ""}`}
                                                        onClick={() => toggleTagSelection(tag.group, tag.tagName)}
                                                    >
                                                        {tag.tagName}
                                                    </button>
                                            ))}
                                        </>
                                    )}
                                </>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="discover-sidebar-header">Filter pins within map bounds</p>
                            <div className="search-sidebar">
                                <div className="search-name-container">
                                    <p className="search-name-label">Filter by name</p>
                                    <input
                                        id="search-name"
                                        className="search-by-name"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        autoComplete="off"
                                    />
                                    {searchQuery && (
                                        <div className="results-container"> 
                                            {filteredPins.length > 0 ? (
                                                <ul className="results">
                                                {filteredPins.map((pin) => (
                                                    <li
                                                        key={pin.id}
                                                        className="small-location-result"
                                                        onClick={() => handleResultClick(pin)}
                                                    >
                                                        <img className="small-location-result-image" src={pin.previewImage.imageUrl} alt="Location Image" />
                                                        <div className="small-location-result-info">
                                                            <p className="small-user-result-username">{pin.locationName}</p>
                                                            <p className="small-user-result-name">{pin.city}</p>
                                                        </div>
                                                    </li>
                                                ))}
                                                </ul>
                                            ) : (
                                                <div className="results">
                                                    <p className="result">No matches found.</p>
                                                </div> 
                                            )}
                                        </div>
                                    )}
                                    <div className="disc-filter-icon">
                                        <p className="search-name-label">Filter by icon type</p>
                                        <div className="disc-options-container">
                                            {pinOptions.map((option) => (
                                                <div
                                                    className={`disc-pin-option ${activePinTypes[option] ? "selected" : ""}`} 
                                                    key={option} 
                                                    onClick={() => togglePinType(option)}
                                                >
                                                    <img className="disc-pin-img" src={getPinIcon(option)} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="disc-tags-container">
                                    <p className="search-name-label">Filter by tags</p>
                                    <>
                                        {!shrinkTags ? (
                                            <>
                                                {Object.entries(tags).map(([group, groupTags]) => (
                                                    <div key={group} className="disc-tag-group">
                                                        {groupTags.map((tag) => (
                                                            <button
                                                                key={tag.tagId}
                                                                className={`disc-tag-btn ${selectedTags[group] === tag.tagName ? "selected" : ""}`}
                                                                onClick={() => toggleTagSelection(group, tag.tagName)}
                                                            >
                                                                {tag.tagName}
                                                            </button>
                                                        ))}
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            <div className="disc-tags-only">
                                                {Object.entries(tags)
                                                    .flatMap(([group, groupTags]) =>
                                                        groupTags.map((tag) => ({ ...tag, group }))
                                                    )
                                                    .map((tag) => (
                                                        <button
                                                            key={tag.tagId}
                                                            className={`disc-tag-btn ${selectedTags[tag.group] === tag.tagName ? "selected" : ""}`}
                                                            onClick={() => toggleTagSelection(tag.group, tag.tagName)}
                                                        >
                                                            {tag.tagName}
                                                        </button>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                </div>
                            </div>
                        </>
                    )}
                        <div className="discover-map-container">
                            {!isStreetView && (
                                <div className="autocomplete-container">
                                    <PlaceAutocomplete
                                        onPlaceSelect={setSelectedPlace}
                                        setCenter={setCenter}
                                        onLocationChange={handleLocationChange}
                                    />
                                </div>
                            )}
                            {!isStreetView && (
                                <div className="control-container">
                                    {controlsModal && (
                                        <div className="map-type-container">
                                            <div className="map-type-controls">
                                                <div className="close-type-container">
                                                    <div onClick={() => setControlsModal(false)} className="close-map-types"><MdClose/></div>
                                                </div>
                                                <div 
                                                    className={`map-type ${mapType === 'roadmap' ? 'selected' : ''}`} 
                                                    onClick={() => handleMapTypeChange('roadmap')}
                                                >
                                                    <p>Roadmap</p>
                                                    <img src={"/assets/images/roadmap.png"} alt="Roadmap" /> {/* Add alt attribute */}
                                                </div>
                                                <div 
                                                    className={`map-type ${mapType === 'satellite' ? 'selected' : ''}`} 
                                                    onClick={() => handleMapTypeChange('satellite')}
                                                >
                                                    <p>Satellite</p>
                                                    <img src={"/assets/images/satellite.png"} alt="Satellite" /> {/* Add alt attribute */}
                                                </div>
                                                <div 
                                                    className={`map-type ${mapType === 'hybrid' ? 'selected' : ''}`} 
                                                    onClick={() => handleMapTypeChange('hybrid')}
                                                >
                                                    <p>Hybrid</p>
                                                    <img src={"/assets/images/hybrid.png"} alt="Hybrid" /> {/* Add alt attribute */}
                                                </div>
                                                <div 
                                                    className={`map-type ${mapType === 'terrain' ? 'selected' : ''}`} 
                                                    onClick={() => handleMapTypeChange('terrain')}
                                                >
                                                    <p>Terrain</p>
                                                    <img src={"/assets/images/terrain.png"} alt="Terrain" /> {/* Add alt attribute */}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="map-type-buttons">
                                        <div className="open-map-types control" onClick={() => setControlsModal(!controlsModal)}><TbMapCog /></div>
                                        <ZoomControl />
                                        <div className="control open-map-types" onClick={() => setCenter(defaultCenter)}><FaLocationCrosshairs /></div>
                                    </div>
                                </div>
                            )}
                            {!mapLoading && (                       
                            <Map
                                defaultZoom={13}
                                center={{ lat: center.lat, lng: center.lng }}
                                defaultCenter={{ lat: center.lat, lng: center.lng }}
                                gestureHandling={"greedy"}
                                mapTypeId={mapType}
                                mapId={MAP_ID}
                                fullscreenControl={false}
                                mapTypeControl={false}
                                minZoom={6}
                                cameraControl={false}
                                onIdle={(map) => handleIdle(map)}
                                onMouseover={(map) => handleMapLoad(map)}
                                onTilesLoaded={(map) => handleMapLoad(map)}
                                onDrag={() => setDragging(true)}
                                onBoundsChanged={handleBoundsChanged}>
                                <AdvancedMarker position={{ lat: center.lat, lng: center.lng }}>
                                    {dragging ? (
                                        <div className="pick-up">
                                            <GiHandOk className="hand" size={littleGuySize} />
                                            <BsPersonArmsUp className="person" size={littleGuySize} />
                                        </div>
                                    ) : (
                                        <BsPersonRaisedHand size={littleGuySize} />
                                    )}
                                </AdvancedMarker>
                                {filteredPins.map((pin) => (
                                    <AdvancedMarker
                                        key={pin.locationId}
                                        ref={(ref) => { markerRefs[pin.locationId] = ref; }}
                                        position={{ lat: pin.latitude, lng: pin.longitude }}
                                        clickable="true"
                                        className="marker"
                                        // onClick={() => handleMarkerClick(pin)}
                                        >
                                            <div
                                                className="pin-icon-container"
                                                onClick={() => handlePinIconMouseOver(pin)}
                                            >
                                                <img className="pin-icon" src={"/assets/icons/marker.png"}/>
                                                <img className="pin-type" src={getPinIcon(pin.pinType)} />
                                            </div>
                                            {infoWindowOpen && selectedPin && selectedPin.locationId === pin.locationId && (
                                                <InfoWindow
                                                    anchor={markerRefs[pin.locationId]}
                                                >
                                                    <div className="pin-card">
                                                        <MdClose className="close-preview" size={15} onClick={handleCloseInfoWindow} />
                                                        <div className="pin-info" onClick={(event) => {openLocationModal(pin.locationId, event)}}>
                                                            <p className="pin-top">{pin.locationName}</p>
                                                            <p className="pin-city">{pin.city}</p>
                                                            <p className="pin-bottom"><IoBookmark/>{pin.saves}</p>
                                                        </div>
                                                        <img src={pin.previewImage.imageUrl} onClick={(event) => {openLocationModal(pin.locationId, event)}}></img>
                                                    </div>
                                                </InfoWindow>
                                            )}
                                    </AdvancedMarker>        
                                ))}
                            </Map>
                        )}
                        <MapHandler setIsStreetView={setIsStreetView} place={selectedPlace} marker={marker} />
                    </div>
                </div>
            </APIProvider>

        {showModal && (
            <LocationModal
                handleModalOpened={handleModalOpened}
                selectedPost={selectedPost}
                closeLocationModal={closeLocationModal}
            />
        )}
        </>
    );
};

const ZoomControl = () => {
    const map = useMap();

    if (!map) return;

    return (
        <div className="zoom-control">
            <button className="control" id="zoom-in" onClick={() => map.setZoom(map.getZoom() + 1)}><ImPlus /></button>
            <button className="control" id="zoom-out" onClick={() => map.setZoom(map.getZoom() - 1)}><ImMinus /></button>
        </div>
    );
};

const MapHandler = ({ setIsStreetView, place, marker }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !map.streetView) return;

        const streetView = map.streetView; // Access streetView from map

        const handleStreetViewChange = () => {
            setIsStreetView(streetView.visible); // Update state based on visibility
        };

        // Add listener to detect when 'visible' changes
        const listener = streetView.addListener("visible_changed", handleStreetViewChange);

        return () => {
            listener.remove(); // Properly remove the event listener
        };
    }, [map]);
  
    useEffect(() => {
      if (!map || !place || !marker) return;
  
      if (place.geometry?.viewport) {
        map.fitBounds(place.geometry?.viewport);
      }
  
      marker.position = place.geometry?.location;
    }, [map, place, marker]);
    return null;
  };

  const PlaceAutocomplete = ({ onPlaceSelect, setCenter, onLocationChange }) => {
    const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
    const inputRef = useRef(null);
    const places = useMapsLibrary("places");
  
    useEffect(() => {
        if (!places || !inputRef.current) return;

        const options = {
            fields: ["geometry", "name", "formatted_address"],
        };

        setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
        }, [places]);

    useEffect(() => {
        if (!placeAutocomplete) return;

        placeAutocomplete.addListener("place_changed", () => {
        const place = placeAutocomplete.getPlace(); 
        const newLat = place.geometry.location.lat();
        const newLng = place.geometry.location.lng();
        setCenter({ lat: newLat, lng: newLng });    // Update map center
        onLocationChange({ lat: newLat, lng: newLng}); // Notify parent component
        onPlaceSelect(placeAutocomplete.getPlace());
        });
    }, [onPlaceSelect, placeAutocomplete, onLocationChange, setCenter]);
    return (      
        <input className="location-search-input" ref={inputRef} />
    );
  };

PlaceAutocomplete.propTypes = {
    onPlaceSelect: PropTypes.func.isRequired,
    onLocationChange: PropTypes.func.isRequired,
    setCenter: PropTypes.func.isRequired,
};

MapHandler.propTypes = {
    place: PropTypes.shape({
        geometry: PropTypes.shape({
        viewport: PropTypes.object,
        location: PropTypes.object,
        }),
    }),
    marker: PropTypes.object, // Or a more specific type if you know the marker's structure
    setIsStreetView: PropTypes.func,
};

export default Discover;