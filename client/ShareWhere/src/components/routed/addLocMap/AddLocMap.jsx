import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { PiMapPinSimpleFill } from "react-icons/pi";
import { MdLocationPin } from "react-icons/md";
import "./addLocMap.css";
import { Map, AdvancedMarker, useMap, useAdvancedMarkerRef, APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import LocationModal from "../locationModal/LocationModal";

const AddLocMap = ({ latitude, longitude, onLocationChange }) => {
    const [center, setCenter] = useState({ lat: latitude, lng: longitude });
    const [mapRef, setMapRef] = useState(null);
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [showModal, setShowModal] = useState(false);
    const [pins, setPins] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [bounds, setBounds] = useState({ north: 0.0, south: 0.0, east: 0.0, west: 0.0 });
    const [selectedPlace, setSelectedPlace] = useState(null);
    const API_KEY = "AIzaSyA3qoBRglmsQ2nyxvGWJ8SCI0az2PCL-bE";
    const MAP_ID = "8556750882f0b69f";

    function openLocationModal(post) {
        setSelectedPost(post);
        console.log(selectedPost);
        setShowModal(true);
    }

    function closeLocationModal() {
        setShowModal(false);
    };

    const handleMapLoad = (map) => {
        setMapRef(map);
        handleBoundsChanged();
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
            onLocationChange({ lat: newLat, lng: newLng});
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

    return (
        <>
            <div className="addloc-map-container">
                <APIProvider
                    apiKey={API_KEY}
                    solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
                    >                
                        <div className="autocomplete-container">
                            <PlaceAutocomplete
                                onPlaceSelect={setSelectedPlace}
                                setCenter={setCenter}
                                onLocationChange={onLocationChange}
                            />
                        </div>
                        
                        <Map
                            defaultZoom={15}
                            defaultCenter={{ lat: center.lat, lng: center.lng }}
                            gestureHandling={"greedy"}
                            disableDefaultUI={true}
                            mapTypeId={"terrain"}
                            mapId={MAP_ID}
                            onDrag={handleMapLoad}
                            onIdle={handleMapLoad}
                            onMousemove={handleMapLoad}
                            onBoundsChanged={handleBoundsChanged}>
                            <AdvancedMarker position={{ lat: center.lat, lng: center.lng }}>
                                <PiMapPinSimpleFill size={40} />
                            </AdvancedMarker>
                            {pins.map((pin) => (
                                <AdvancedMarker
                                    key={pin.locationId}
                                    position={{ lat: pin.latitude, lng: pin.longitude }}
                                    clickable="true"
                                    className="marker"
                                    >
                                    <div className="location-pin">
                                        <div className="pin-card" onClick={() => {openLocationModal(pin)}}>
                                            <img src={`data:${pin.images[0].imageType};base64,${pin.images[0].imageData}`}></img>
                                            <p>{pin.locationName}</p>
                                        </div>
                                        <MdLocationPin size={40}/>
                                    </div>
                                </AdvancedMarker>
                            ))}
                        </Map>
                        <MapHandler place={selectedPlace} marker={marker} />
                </APIProvider>
            </div>

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


AddLocMap.propTypes = {
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    onLocationChange: PropTypes.func.isRequired,
};



export default AddLocMap;