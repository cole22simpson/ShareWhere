import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { MdLocationPin } from "react-icons/md";
import { IoBookmark  } from "react-icons/io5";
import { BsPersonArmsUp, BsPersonRaisedHand } from "react-icons/bs";
import { FaCircle } from "react-icons/fa6";
import { TbSunset2 } from "react-icons/tb";
import { GiHandOk } from "react-icons/gi";
import "./discover.css";
import { Map, AdvancedMarker, useMap, useAdvancedMarkerRef, Pin, APIProvider, useMapsLibrary, MapControl, ControlPosition } from "@vis.gl/react-google-maps";
import LocationModal from "../locationModal/LocationModal";

const Discover = () => {
    // const coordinates = JSON.parse(localStorage.getItem("user.latitude"));
    const user = JSON.parse(localStorage.getItem("user"));
    const defaultCenter = {lat: user.latitude, lng: user.longitude};
    const [center, setCenter] = useState({ lat: defaultCenter.lat, lng: defaultCenter.lng });
    const [mapRef, setMapRef] = useState(null);
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [showModal, setShowModal] = useState(false);
    const [pins, setPins] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [bounds, setBounds] = useState({ north: 0.0, south: 0.0, east: 0.0, west: 0.0 });
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const API_KEY = "AIzaSyA3qoBRglmsQ2nyxvGWJ8SCI0az2PCL-bE";
    const MAP_ID = "8556750882f0b69f";
    
    const filteredPins = searchQuery 
    ? pins
        .filter((pin) => 
          pin.locationName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 10) 
    : [];

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleLocationChange = ({ lat, lng }) => {
        setCenter({ lat: lat, lng: lng });
    };

    const openLocationModal  = async (pinId) => {
        const locationId = pinId;
        try {
            const response = await fetch(`http://localhost:8080/locations/${locationId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
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

    const handleDrag = () => {
        setDragging(true);
    };

    const handleIdle = () => {
        setDragging(false);
    };

    const handleBoundsChanged = () => {
        if (mapRef) {
            const mapBounds = mapRef.map.getBounds();
            const north = mapBounds.ii.hi;
            const south = mapBounds.ii.lo;
            const east = mapBounds.Gh.lo;
            const west = mapBounds.Gh.hi;
            setBounds({ north: north, south: south, east: east, west: west });
            
            const newLat = mapRef.map.center.lat();
            const newLng = mapRef.map.center.lng();
            setCenter({ lat: newLat, lng: newLng });
            loadPins();
            handleLocationChange({ lat: newLat, lng: newLng});
        }
    };

    const loadPins = async () => {
        try {
            const response = await fetch(`http://localhost:8080/locations/pins?north=${bounds.north}&south=${bounds.south}&east=${bounds.east}&west=${bounds.west}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error fetching user:", response.status, errorData);
                return;
            }
            
            try {
                const locationData = await response.json(); // Extract the JSON data
                setPins(locationData);                                
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

    return (
        <>      
            <APIProvider
                apiKey={API_KEY}
                solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
            >
                <div className="discover-container">
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
                                <div> 
                                    {filteredPins.length > 0 ? (
                                        <ul className="results">
                                        {filteredPins.map((pin) => (
                                            <li
                                                key={pin.id}
                                                className="result"
                                            >
                                                {pin.locationName}
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
                    </div>
                    <div className="discover-map-container">
                        <div className="autocomplete-container">
                            <PlaceAutocomplete
                                onPlaceSelect={setSelectedPlace}
                                setCenter={setCenter}
                                onLocationChange={handleLocationChange}
                            />
                        </div>                                        
                        <Map
                            defaultZoom={15}
                            center={{ lat: center.lat, lng: center.lng }}
                            defaultCenter={{ lat: center.lat, lng: center.lng }}
                            gestureHandling={"greedy"}
                            mapTypeId={"terrain"}
                            mapId={MAP_ID}
                            fullscreenControl={false}
                            mapTypeControlOptions={{ position: ControlPosition.TOP_RIGHT }}
                            onMousemove={(map) => handleMapLoad(map)}
                            onDrag={handleDrag}
                            onIdle={handleIdle}
                            onBoundsChanged={handleBoundsChanged}>
                            <MapControl position={ControlPosition.BOTTOM_RIGHT}></MapControl>
                            <AdvancedMarker position={{ lat: center.lat, lng: center.lng }}>
                                {dragging ? (
                                    <div className="pick-up">
                                        <GiHandOk className="hand" size={40} />
                                        <BsPersonArmsUp className="person" size={40} />
                                    </div>
                                ) : (
                                    <BsPersonRaisedHand size={40} />
                                )}
                            </AdvancedMarker>
                            {pins.map((pin) => (
                                <AdvancedMarker
                                    key={pin.locationId}
                                    position={{ lat: pin.latitude, lng: pin.longitude }}
                                    clickable="true"
                                    className="disc-marker"
                                    >
                                        <div className="disc-pin-card" onClick={() => {openLocationModal(pin.locationId)}}>
                                            <p className="disc-pin-top">{pin.locationName}</p>
                                            <img src={pin.previewImage.imageUrl}></img>
                                            <p className="disc-pin-bottom"><IoBookmark/>{pin.saves}</p>
                                        </div>
                                        <MdLocationPin size={40} />
                                </AdvancedMarker>
                            ))}
                        </Map>
                        <MapHandler place={selectedPlace} marker={marker} />
                    </div>
                </div>
            </APIProvider>

        {showModal && (
            <LocationModal
                selectedPost={selectedPost}
                closeLocationModal={closeLocationModal}
            />
        )}
        </>
    );
};

const MapHandler = ({ place, marker }) => {
    const map = useMap();
  
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
    };

export default Discover;