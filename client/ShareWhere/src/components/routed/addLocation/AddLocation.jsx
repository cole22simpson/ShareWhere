import "./addLocation.css";
import { useState, useEffect, useRef } from "react";
import { getLocation } from "../../../assets/helpers/getLocation";
import LocationForm from "../locationForm/LocationForm.jsx";

function AddLocation() {
    const positionRef = useRef({ lat: 0.0, lng: 0.0 });
    const [initialLatitude, setInitialLatitude] = useState(positionRef.current.lat);
    const [initialLongitude, setInitialLongitude] = useState(positionRef.current.lng);
    const [isLoading, setIsLoading] = useState(true);
    const [tags, setTags] = useState({});
    const [selectedTags, setSelectedTags] = useState({});
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const coords = await getLocation();
                positionRef.current = coords;
                setInitialLatitude(coords.lat);
                setInitialLongitude(coords.lng);
                localStorage.setItem("userCoordinates", JSON.stringify(coords));
            } catch (error) {
                console.error(error);
            }
            setIsLoading(false);
        };

        const storedCoords = localStorage.getItem("userCoordinates");
        if (storedCoords) {
            const coords = JSON.parse(storedCoords);
            setInitialLatitude(coords.lat);
            setInitialLongitude(coords.lng);


            setIsLoading(false);
        } else {
            fetchLocation();
        }
    }, []);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                const response = await fetch("http://localhost:8080/tags", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
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

    return (
        <>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <LocationForm
                    initialLatitude={initialLatitude}
                    initialLongitude={initialLongitude}
                    tags={tags}
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                    images={images}
                    setImages={setImages}
                />
            )}
        </>
    );
}

export default AddLocation;
