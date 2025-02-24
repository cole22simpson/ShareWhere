import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { PiMapPinSimpleFill } from "react-icons/pi";
import { IoBookmark  } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { TbMapCog } from "react-icons/tb";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { ImPlus, ImMinus } from "react-icons/im";
import "./addLocMap.css";
import { Map, AdvancedMarker, useMap, useAdvancedMarkerRef, InfoWindow, APIProvider, ControlPosition, useMapsLibrary, MapControl } from "@vis.gl/react-google-maps";
import LocationModal from "../locationModal/LocationModal";

const AddLocMap = ({ initialLatitude, initialLongitude, latitude, longitude, onLocationChange }) => {
    const [center, setCenter] = useState({ lat: latitude, lng: longitude });
    const [mapRef, setMapRef] = useState(null);
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [showModal, setShowModal] = useState(false);
    const [mapType, setMapType] = useState("terrain");
    const [infoWindowOpen, setInfoWindowOpen] = useState(false);
    const markerRefs = useRef({});
    const [selectedPin, setSelectedPin] = useState(null);
    const [pins, setPins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isStreetView, setIsStreetView] = useState(false);
    const [controlsModal, setControlsModal] = useState(false);
    const [mapLoading, setMapLoading] = useState(true);
    const [bounds, setBounds] = useState({ north: 0.0, south: 0.0, east: 0.0, west: 0.0 });
    const [selectedPlace, setSelectedPlace] = useState(null);
    const MAP_ID = import.meta.env.VITE_MAP_ID;
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

    const handleModalOpened = (action) => {
        if (action === true) {
            document.body.classList.add("hidden");
        }
        else {
            document.body.classList.remove("hidden");
        }
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

    const openLocationModal  = async (pinId) => {
        const location_id = pinId;
        try {
            const response = await fetch(`http://localhost:8080/locations/${location_id}`, {
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

    const handleMapLoad = (map) => {
        setMapRef(map);
        handleBoundsChanged();
    };

    const handleIdle = (map) => {
        handleMapLoad(map);
        loadPins();
    };

    const handleBoundsChanged = () => {
        if (mapRef) {
            const mapBounds = mapRef.map.getBounds();
            const north = mapBounds.ji.hi;
            const south = mapBounds.ji.lo;
            const east = mapBounds.Gh.lo;
            const west = mapBounds.Gh.hi;
            setBounds({ north: north, south: south, east: east, west: west });
            
            const newLat = mapRef.map.center.lat();
            const newLng = mapRef.map.center.lng();
            setCenter({ lat: newLat, lng: newLng });
            onLocationChange({ lat: newLat, lng: newLng});
        }
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

    const handleCloseInfoWindow = () => {
        setInfoWindowOpen(false);
        setSelectedPin(null); // Clear the selected pin when the info window is closed
    };

    const loadPins = async () => {
        try {
            const response = await fetch(`http://localhost:8080/locations/pins?north=${bounds.north}&south=${bounds.south}&east=${bounds.east}&west=${bounds.west}`, {
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

    useEffect(() => {
        if (mapRef && !mapLoading) {
            setCenter({ lat: latitude, lng: longitude });
        }
    }, [mapRef, latitude, longitude, mapLoading]);

    return (
        <>
            <APIProvider
                apiKey={API_KEY}
                solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
            >
                <div className="map-container">                
                    {!isStreetView && (
                        <div className="autocomplete-container">
                            <PlaceAutocomplete
                                onPlaceSelect={setSelectedPlace}
                                setCenter={setCenter}
                                onLocationChange={onLocationChange}
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
                                <div className="control open-map-types" onClick={() => setCenter( { lat: initialLatitude, lng: initialLongitude })}><FaLocationCrosshairs /></div>
                            </div>
                        </div>
                    )}
                    {!mapLoading && ( 
                    <Map
                        defaultZoom={15}
                        center={{ lat: center.lat, lng: center.lng }}
                        defaultCenter={{ lat: center.lat, lng: center.lng }}
                        gestureHandling={"greedy"}
                        mapTypeId={mapType}
                        mapId={MAP_ID}
                        fullscreenControl={false}
                        mapTypeControl={false}
                        mapTypeControlOptions={{ position: ControlPosition.TOP_RIGHT }}
                        onIdle={(map) => handleIdle(map)}
                        onMouseover={(map) => handleMapLoad(map)}
                        onTilesLoaded={(map) => handleMapLoad(map)}
                        onBoundsChanged={handleBoundsChanged}>
                        <AdvancedMarker position={{ lat: center.lat, lng: center.lng }}>
                            <PiMapPinSimpleFill size={40} />
                        </AdvancedMarker>
                        {pins.map((pin) => (
                            <AdvancedMarker
                                key={pin.locationId}
                                ref={(ref) => { markerRefs[pin.locationId] = ref; }}
                                position={{ lat: pin.latitude, lng: pin.longitude }}
                                clickable="true"
                                className="marker"
                                onClick={() => handleMarkerClick(pin)}
                                >
                                    <div
                                        className="pin-icon-container"
                                        onMouseOver={() => handlePinIconMouseOver(pin)}
                                        onMouseOut={handlePinIconMouseOut}
                                        onClick={() => openLocationModal(pin.locationId)}>
                                        <img className="pin-icon" src={"/assets/icons/marker.png"}/>
                                        <img className="pin-type" src={getPinIcon(pin.pinType)} />
                                    </div>
                                    {infoWindowOpen && selectedPin && selectedPin.locationId === pin.locationId && (
                                        <InfoWindow
                                            anchor={markerRefs[pin.locationId]}                                                
                                            onCloseClick={() => handleCloseInfoWindow}>
                                            <div className="pin-card"
                                                onClick={() => {openLocationModal(pin.locationId)}}>
                                                <div className="pin-info">
                                                    <p className="pin-top">{pin.locationName}</p>
                                                    <p className="pin-city">{pin.city}</p>
                                                    <p className="pin-bottom"><IoBookmark/>{pin.saves}</p>
                                                </div>
                                                <img src={pin.previewImage.imageUrl}></img>
                                            </div>
                                        </InfoWindow>
                                    )}
                            </AdvancedMarker>      
                        ))}
                    </Map>
                    )}
                    <MapHandler setIsStreetView={setIsStreetView} place={selectedPlace} marker={marker} />                
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


AddLocMap.propTypes = {
    initialLatitude: PropTypes.number.isRequired,
    initialLongitude: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number,
    onLocationChange: PropTypes.func.isRequired,
};



export default AddLocMap;