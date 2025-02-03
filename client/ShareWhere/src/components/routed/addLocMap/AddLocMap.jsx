import PropTypes from "prop-types";
import { useState, useCallback } from "react";
import "./addLocMap.css";
import { Map, AdvancedMarker, Pin, MapControl, ControlPosition, InfoWindow } from "@vis.gl/react-google-maps";

const AddLocMap = ({ latitude, longitude, onLocationChange }) => {
    const [center, setCenter] = useState({ lat: latitude, lng: longitude });

    return (
        <div className="addloc-map-container">
            <Map
                defaultZoom={15}
                // defaultCenter={{ lat: latitude, lng: longitude }}
                center={{ lat: 10.45796, lng: -84.64281 }}
                gestureHandling={"greedy"}
                disableDefaultUI={true}
                mapTypeId={"terrain"}
                mapId={"8556750882f0b69f"}>
                <MapControl position={ControlPosition.TOP_LEFT}>
                    {/* <AdvancedMarker position={{ lat: center.lat, lng: center.lng }}> */}
                    <AdvancedMarker position={{ lat: 10.45796, lng: -84.64281 }}>
                        <Pin background="red" borderColor="black" glyphColor="red" />
                    </AdvancedMarker>
                </MapControl>
            </Map>
        </div>
    );
};

AddLocMap.propTypes = {
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    onLocationChange: PropTypes.func.isRequired,
};

export default AddLocMap;
