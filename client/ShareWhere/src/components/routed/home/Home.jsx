import "./home.css";
import { useState, useEffect } from "react";
import useAuth from "../authContext/useAuth";
import HomePostSection from "../homePostSection/HomePostSection";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import LocationModal from "../locationModal/LocationModal";


function Home() {
    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [queryResults, setQueryResults] = useState([]);
    const { userLoggedIn } = useAuth();
    const [hasAccount, setHasAccount] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const navigate = useNavigate();

    const openLocationModal  = async (pinId) => {
        const location_id = pinId;
        try {
            const response = await fetch(`https://sharewheresocial.com/locations/${location_id}`, {
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
            const response = await fetch(`https://sharewheresocial.com/search?query=${query}`, {
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
                    <div className="home-form-container">
                        <input
                            className="home-search-bar"
                            placeholder="Search by name, username, or location name"
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
                                                <p className="location-result-name">{result.locationName}</p>
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
                            {city !== "" ? (
                                <p className="favorites-title">
                                    Local favorites near <span>{city}</span>
                                </p>
                            ) : (
                                <p className="favorites-title">
                                    Nearby favorites
                                </p>
                            )}
                        </div>
                        <HomePostSection postType={"NEARBY"}/>
                    </div>
                    {userLoggedIn && (
                        <div className="local-post-container">
                            <div className="local-favorites">
                                <p className="favorites-title">
                                    Recents from your following
                                </p>
                            </div>
                            <HomePostSection postType={"FOLLOWING"}/>
                        </div>
                    )}
                    <div className="local-post-container">
                        <div className="local-favorites">
                            <p className="favorites-title">
                                Great views
                            </p>
                        </div>
                        <HomePostSection postType={"VIEW"}/>
                    </div>
                    <div className="local-post-container">
                        <div className="local-favorites">
                            <p className="favorites-title">
                                If you want to go swimming
                            </p>
                        </div>
                        <HomePostSection postType={"WATER"}/>
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