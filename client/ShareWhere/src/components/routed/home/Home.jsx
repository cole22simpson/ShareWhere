import "./home.css";
import { useState, useEffect } from "react";
import useAuth from "../authContext/useAuth";
import HomePostSection from "../homePostSection/HomePostSection";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import LocationModal from "../locationModal/LocationModal";
import UseAnimations from "react-useanimations";
import loading from 'react-useanimations/lib/loading';
import { getLocation, getGeneralLocation } from "../../../assets/helpers/getLocation";


function Home() {
    const [coords, setCoords] = useState(() => {
        const storedCoords = localStorage.getItem("coords");
    
        if (storedCoords) {
            try {
                return JSON.parse(storedCoords); // Parse the string
            } catch (error) {
                console.error("Error parsing coords from local storage:", error);
                return { lat: 0.0, lng: 0.0 }; // Handle parsing error
            }
        } else {
            return { lat: 0.0, lng: 0.0 }; // Set default coords
        }
    });
    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [queryResults, setQueryResults] = useState([]);
    const { userLoggedIn } = useAuth();
    const [hasAccount, setHasAccount] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [locationLoaded, setLocationLoaded] = useState(false); // Track location loading

    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const openLocationModal  = async (pinId) => {
        const location_id = pinId;
        try {
            const response = await fetch(`${API_BASE_URL}/api/locations/${location_id}`, {
                method: "GET",
                credentials: "include",
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


    const handleResultClick = (resultId, resultType) => {
        if (!userLoggedIn && resultType === "USER") {
            navigate("/login");
        }
        else if (resultType === "USER") {
            navigate(`/profile/${resultId}`);
        }
        else if (resultType === "LOCATION") {
            openLocationModal(resultId);
        }
    }
    
    useEffect(() => {
        if (localStorage.getItem("name")) {
            setName(localStorage.getItem("name"));
            setHasAccount(true);
        }
        if (localStorage.getItem("city")) {
            setCity(localStorage.getItem("city"));
            setHasAccount(true);
        }
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        if (event.target.value.trim() !== "") {
            loadResults(event.target.value);
        } else {
            setQueryResults([]);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setQueryResults([]);
    };

    const handleModalOpened = (action) => {
        if (action === true) {
            document.body.classList.add("hidden");
        }
        else {
            document.body.classList.remove("hidden");
        }
    };

    const loadResults = async (query) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/search?query=${query}`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error fetching search results:", response.status, errorData);
            } else {
              const responseData = await response.json();
              setQueryResults(responseData);
            }

        } catch (error) {
            console.error("Error loading search results:", error);
        }
    };

    const handleGetGeneralLocation = async () => {
        try {
            const response = await getGeneralLocation();
            if (response && response.ok) {
                const newCoords = {
                    lat: parseFloat(response.latitude),
                    lng: parseFloat(response.longitude),
                };
                setCoords(newCoords); // Update the coords state
                setCity(response.city);
                setLocationLoaded(true);
            }
            else {
                const response = await getLocation();
                const newCoords = {
                    lat: parseFloat(response.lat),
                    lng: parseFloat(response.lng),
                };
                setCoords(newCoords); // Update the coords state
                setLocationLoaded(true);
            }
        } catch (error) {
            console.error("Error getting general location:", error);
        }
    };

    const handleGetLocation = async () => {
        const userId = parseInt(localStorage.getItem("userId"));
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}/coords`, {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            const newCoords = {
                lat: parseFloat(data[0]),
                lng: parseFloat(data[1]),
            };
            setCoords(newCoords);
            setLocationLoaded(true);
        }
    };

    useEffect(() => {
        if (!userLoggedIn) {
            handleGetGeneralLocation();
        }
        else {
            handleGetLocation();
        }
    }, []);

    useEffect(() => {
        const handleCoordsChange = async () => {
            if (coords.lat !== 0.0 && coords.lng !== 0.0) {
                localStorage.setItem("coords", JSON.stringify(coords));
            }
        };
    
        handleCoordsChange();
    }, [locationLoaded]);

    return (
              <>
                <div className="banner-container">
                    {hasAccount ? (
                        <p className="greeting">
                            Where to today, {name}?
                        </p>
                    ) : (
                        <h1 className="greeting">
                            Welcome to ShareWhere
                        </h1>
                    )}
                    <div className="tag-line">
                        Explore points of interest near you and around the world
                    </div>
                    <div className="home-form-container">
                        <input
                            className="home-search-bar"
                            placeholder="Search for specific users or posts"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            autoComplete="off"
                        />
                        {searchQuery !== "" && (
                            <MdClose className="clear-query" onClick={clearSearch} />
                        )}
                        {queryResults.length > 0 && (
                            <ul className="search-results-dropdown">
                                {queryResults.map((result, index) => (
                                    <li key={index} className="search-result-item" onClick={() => handleResultClick(result.resultId, result.resultType)}>
                                        {result.resultType === "USER" ? (
                                            <div className="user-result">
                                                <img src={result.imageUrl} />
                                                <div className="user-result-info">
                                                    <p className="user-result-username">{result.username}</p>
                                                    <p className="user-result-name">{result.name}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="location-result">
                                                <img className="location-result-image" src={result.imageUrl} alt="Location Image" />
                                                <div className="location-result-info">
                                                    <p className="user-result-username">{result.locationName}</p>
                                                    <p className="user-result-name">{result.city}</p>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="home-post-container">
                    <div className="local-post-container">
                        <div className="local-favorites">
                            <p className="favorites-title">
                                Global favorites
                            </p>
                        </div>
                        {locationLoaded ? (
                            <HomePostSection postType={"GLOBAL"} coords={coords}/>
                        ) : (
                            <div><UseAnimations animation={loading} size={25} /></div>
                        )}
                    </div>
                    <div className="local-post-container">
                        <div className="local-favorites">
                            <p className="favorites-title">
                                Nearby favorites
                            </p>
                        </div>
                        {locationLoaded ? (
                            <HomePostSection postType={"NEARBY"} coords={coords}/>
                        ) : (
                            <div><UseAnimations animation={loading} size={25} /></div>
                        )}
                    </div>
                    {userLoggedIn && (
                        <div className="local-post-container">
                            <div className="local-favorites">
                                <p className="favorites-title">
                                    Recents from your following
                                </p>
                            </div>
                            {locationLoaded ? (
                                <HomePostSection postType={"FOLLOWING"} coords={coords}/>
                            ) : (
                                <div><UseAnimations animation={loading} size={25} /></div>
                            )}
                        </div>
                    )}
                    <div className="local-post-container">
                        <div className="local-favorites">
                            <p className="favorites-title">
                                Great views
                            </p>
                        </div>
                        {locationLoaded ? (
                            <HomePostSection postType={"VIEW"} coords={coords}/>
                        ) : (
                            <div><UseAnimations animation={loading} size={25} /></div>
                        )}
                    </div>
                    <div className="local-post-container">
                        <div className="local-favorites">
                            <p className="favorites-title">
                                If you want to go swimming
                            </p>
                        </div>
                        {locationLoaded ? (
                            <HomePostSection postType={"WATER"} coords={coords}/>
                        ) : (
                            <div><UseAnimations animation={loading} size={25} /></div>
                        )}
                    </div>
                </div>

                {showModal && (
                    <LocationModal
                        handleModalOpened={(handleModalOpened)}
                        selectedPost={selectedPost}
                        closeLocationModal={closeLocationModal}
                    />
                )}
              </> 
            );
}

export default Home;