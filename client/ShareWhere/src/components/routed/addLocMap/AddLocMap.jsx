import PropTypes from "prop-types";
import "./addLocMap.css";
import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

const AddLocMap = ({ latitude, longitude }) => {
    return (
        <div className="addloc-map-container">
            <Map
                defaultZoom={15}
                defaultCenter={{ lat: latitude, lng: longitude }}
                gestureHandling={"greedy"}
                disableDefaultUI={true}
                mapTypeId={"terrain"}
                mapId={"8556750882f0b69f"}>
                <AdvancedMarker position={{ lat: latitude, lng: longitude }}>
                    <Pin background="red" borderColor="black" glyphColor="red" />
                </AdvancedMarker>
            </Map>
        </div>
    );
};

AddLocMap.propTypes = {
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
};

export default AddLocMap;
