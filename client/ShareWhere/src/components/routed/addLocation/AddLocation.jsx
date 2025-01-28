import "./addLocation.css";
import { useState } from "react";
import {
    APIProvider,
    Map,
    AdvancedMarker,
    // MapCameraChangedEvent,
    Pin,
    // InfoWindow
} from "@vis.gl/react-google-maps";

// import { GooglePlacesAutocomplete } from "react-google-places-autocomplete";

// const libraries = ["places"];

function AddLocation () {

    const [position, setPosition] = useState({ lat: 32.928852, lng: -117.062757 });
    // const [mapType, setMapType] = useState("satellite");

    const handlePlaceChanged = (place) => {
        if (place && place.geometry && place.geometry.location) {
            setPosition({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            });
        }
    };

    // const handleMapTypeChanged = (newMapType) => {
    //     setMapType(newMapType);
    // };

    return (
        <>
            <APIProvider apiKey="AIzaSyA3qoBRglmsQ2nyxvGWJ8SCI0az2PCL-bE">
                <div className="addloc-container">
                    <div className="addloc-sidebar">
                        <label>Name your location</label>
                        <input

                        />
                    </div>
                    <div className="addloc-map-container">
                    {/* <GooglePlacesAutocomplete
                            onChange={handlePlaceChanged}
                            libraries={libraries}
                        >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
                                <div>
                                <input
                                  {...getInputProps({
                                    placeholder: 'Search Places',
                                    className: 'search-input',
                                  })}
                                />
                                <div className="suggestions">
                                  {loading && <div>Loading...</div>}
                                  {suggestions.map((suggestion) => (
                                    <div key={suggestion.id} {...getSuggestionItemProps(suggestion)}>
                                      {suggestion.description}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            }}
                        </GooglePlacesAutocomplete> */}
                        <Map
                            defaultZoom={9}
                            defaultCenter={position}
                            mapTypeId={"satellite"}
                            mapId={"8556750882f0b69f"}
                            onCameraChanged={handlePlaceChanged}
                            >
                            <AdvancedMarker position={position}>
                                <Pin
                                    background={"red"}
                                    borderColor={"black"}
                                    glyphColor={"red"}
                                />
                            </AdvancedMarker>
                        </Map>

                        {/* <div className="map-type-controls">
                        <button onClick={() => handleMapTypeChanged('roadmap')}>
                            Roadmap
                        </button>
                        <button onClick={() => handleMapTypeChanged('satellite')}>
                            Satellite
                        </button>
                        <button onClick={() => handleMapTypeChanged('terrain')}>
                            Terrain
                        </button>
                        </div> */}
                    </div>
                </div>
            </APIProvider>
        </>
    );
};

export default AddLocation;