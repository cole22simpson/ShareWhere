import "./saved.css";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import LocationModal from "../locationModal/LocationModal";
import UseAnimations from "react-useanimations";
import loading from 'react-useanimations/lib/loading';

const Saved = () => {

    const [saved, setSaved] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPin, setSelectedPin] = useState(null);

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
                setSelectedPin(pinData);
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

    const loadSaved = async () => {
        setIsLoading(true);

        try {
            const userId = localStorage.getItem("userId");
            const response = await fetch(`http://localhost:8080/users/${userId}/saved`, {
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
                const data = await response.json(); // Extract the JSON data 
                setSaved(data.reverse());
                                
            } catch (error) {
                console.error("Error parsing JSON:", error); // Handle JSON parsing errors
            }

        } catch (error) {
            console.error("Error loading user:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
            loadSaved();
    }, [showModal]);

    return (

        <>
            {isLoading ? (
                <div className="loading"><UseAnimations animation={loading} size={56} /></div>
            ) : (
                <>
                    <div className={`posts-container ${saved.length === 0 ? 'none' : ''}`}>
                        {saved.map((post) => (
                            <div key={post.locationId} className="post" onClick={() => {openLocationModal(post.locationId)}}>
                                {post.previewImage && ( // Conditional rendering of the image
                                    <img src={post.previewImage.imageUrl} alt="Saved post" />
                                )}
                                <p>{post.locationName}</p>
                            </div>
                        ))}
                        {saved.length === 0 && (
                            <div className="no-posts-container">
                                <p className="no-posts">Nothing saved yet</p>
                            </div>
                        )}
                    </div>
                    {showModal && (
                        <LocationModal
                            selectedPost={selectedPin}
                            closeLocationModal={closeLocationModal}
                        />
                    )}
                </>
            )}
        </>
    );
};

export default Saved;