import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { PiMapPinSimpleFill } from "react-icons/pi";
import "./addLocMap.css";
import { Map, AdvancedMarker, useMap, useAdvancedMarkerRef, APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";

const AddLocMap = ({ latitude, longitude, onLocationChange }) => {
    const [center, setCenter] = useState({ lat: latitude, lng: longitude });
    const [mapRef, setMapRef] = useState(null);
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [selectedPlace, setSelectedPlace] = useState(null);
    const API_KEY = "AIzaSyA3qoBRglmsQ2nyxvGWJ8SCI0az2PCL-bE";
    const MAP_ID = "8556750882f0b69f";

    const handleMapLoad = (map) => {
        setMapRef(map);
    };

    const handleBoundsChanged = () => {
        if (mapRef) {
            const newLat = mapRef.map.center.lat();
            const newLng = mapRef.map.center.lng();
            setCenter({ lat: newLat, lng: newLng });
            onLocationChange({ lat: newLat, lng: newLng});
        }
    };

    return (

        <div className="addloc-map-container">
            <APIProvider
                apiKey={API_KEY}
                solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
                onLoad={handleMapLoad}
                >                
                    <div className="autocomplete-container">
                        <PlaceAutocomplete
                            onPlaceSelect={setSelectedPlace}
                            setCenter={setCenter}
                            onLocationChange={onLocationChange} />
                    </div>
                    
                    <Map
                        defaultZoom={15}
                        defaultCenter={{ lat: center.lat, lng: center.lng }}
                        center={{ lat: center.lat, lng: center.lng }}
                        gestureHandling={"greedy"}
                        disableDefaultUI={true}
                        mapTypeId={"terrain"}
                        mapId={MAP_ID}
                        onDrag={handleMapLoad}
                        onIdle={handleMapLoad}
                        onBoundsChanged={handleBoundsChanged}>
                        <AdvancedMarker position={{ lat: center.lat, lng: center.lng }}>
                            <PiMapPinSimpleFill size={40} />
                        </AdvancedMarker>
                    </Map>
                    <MapHandler place={selectedPlace} marker={marker} />
            </APIProvider>
        </div>
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