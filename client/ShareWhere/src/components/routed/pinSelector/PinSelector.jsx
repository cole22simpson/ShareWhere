import "./pinSelector.css";
import { useState } from "react";
import PropTypes from "prop-types";

const PinSelector = ({ pinType, setPinType }) => {

    const [selected, setSelected] = useState("DEFAULT");

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
    ]

    const handlePinSelect = (option) => {
        setPinType(option);
        setSelected(option);
    }

    return (
        <div className="pin-selector-container">
            <p className="addloc-label">Choose location pin</p>
            <div className="options-container">
            {pinOptions.map((option) => (
                <div className={`pin-option ${option === selected ? "selected" : ""}`} key={option} onClick={() => handlePinSelect(option)}>
                    <img className="pin-img" src={getPinIcon(option)} />
                </div>
            ))}
            </div>
        </div>
    );
};

PinSelector.propTypes = {
    pinType: PropTypes.string.isRequired,
    setPinType: PropTypes.func.isRequired,
}

export default PinSelector;