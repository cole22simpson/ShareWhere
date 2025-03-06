import { useState, useEffect, useRef } from "react";
import { getLocation } from "../../../assets/helpers/getLocation";
import LocationForm from "../locationForm/LocationForm.jsx";
import useAuth from "../authContext/useAuth";
import { useNavigate } from "react-router-dom";

function AddLocation() {
    const positionRef = useRef({ lat: 0.0, lng: 0.0 });
    const [initialLatitude, setInitialLatitude] = useState(positionRef.current.lat);
    const [initialLongitude, setInitialLongitude] = useState(positionRef.current.lng);
    const [isLoading, setIsLoading] = useState(true);
    const [tags, setTags] = useState({});
    const [selectedTags, setSelectedTags] = useState({});
    const [images, setImages] = useState([]);
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const storedCoords = JSON.parse(localStorage.getItem("coords"));
        positionRef.current = storedCoords;
        setInitialLatitude(storedCoords.lat);
        setInitialLongitude(storedCoords.lng);
        setIsLoading(false);

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
