import {useState, useEffect} from "react";
import useAuth from "../authContext/useAuth";
import HomePost from "../homePost/HomePost";
import PropTypes from "prop-types";
import { RiArrowLeftCircleLine, RiArrowRightCircleLine } from "react-icons/ri";
import { BsPersonPlusFill } from "react-icons/bs";
import { getLocation, getGeneralLocation } from "../../../assets/helpers/getLocation";

const HomePostSection = ({ postType, coords }) => {
    const { userLoggedIn, setUserLoggedIn } = useAuth(); // No need to set userLoggedIn here
    const [postData, setPostData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpened, setModalOpened] = useState(false);
    const [locationLoaded, setLocationLoaded] = useState(false); // Track location loading
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(4);

    useEffect(() => {
        function handleResize() {
            // if (window.innerWidth < 600 || window.innerHeight < 600) {
            //     setPostsPerPage(2);
            // }
            // else 
            if (window.innerWidth < 950) {
                setPostsPerPage(3);
            }
            else {
                setPostsPerPage(4);
            }
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderPosts = (posts) => {
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = Math.min(startIndex + postsPerPage, posts.length); // Handle last page

        const currentPosts = posts.slice(startIndex, endIndex);

        if (currentPosts.length > 0) {
            return (
                <div className="posts-housing">
                    <div className="local-posts">
                        {currentPosts.map((post) => (
                            <HomePost
                                key={post.locationId}
                                post={post}
                                handleModalOpened={handleModalOpened}
                                setModalOpened={setModalOpened}
                            />
                        ))}
                    </div>
                    <hr />
                </div>   
            );   
         } else {
            
            const noPostsMessage = postType === "FOLLOWING" ? (
                <>No posts yet</>
            ) : (
                "No posts nearby"
            );

            return (
                <div className="posts-housing">
                    <div className="no-following">
                        {noPostsMessage}
                    </div>
                    <hr />
                </div>
            );
         };
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = (posts) => {
        const totalPages = Math.ceil(posts.length / postsPerPage);

        if (totalPages <= 1) {
            return null;
        }

        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="pagination">
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1} // Disable left arrow on first page
                    >
                        <RiArrowLeftCircleLine />
                    </button>
                    <button
                        onClick={() => handlePageChange(2)}
                        disabled={currentPage === 2 || totalPages === 1} // Disable right arrow on second or only page
                    >
                        <RiArrowRightCircleLine />
                    </button>
            </div>
        );
    };

    const handleModalOpened = (action) => {
        if (action) {
            setModalOpened(true);
            document.body.classList.add("hidden");
        } else {
            setModalOpened(false);
            document.body.classList.remove("hidden");
        }
    };

    const getBoundingCoordinates = (lat, lng, distanceInMiles) => {
        const milesPerDegreeLat = 69;
        const milesPerDegreeLng = 69 * Math.cos((lat * Math.PI) / 180);

        return {
            north: lat + (distanceInMiles / milesPerDegreeLat),
            south: lat - (distanceInMiles / milesPerDegreeLat),
            east: lng + (distanceInMiles / milesPerDegreeLng),
            west: lng - (distanceInMiles / milesPerDegreeLng),
        };
    };

    const loadFollowing = async () => {
        setIsLoading(true);
        try {
            const user_id = localStorage.getItem("userId");
            const response = await fetch(`${API_BASE_URL}/api/users/${user_id}/following`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error fetching following data:", response.status, errorData);
            } else {
                const userData = await response.json();
                setPostData(userData.followingPosts);
            }
        } catch (error) {
            console.error("Error loading following data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadHomePosts = async (type) => {
        setIsLoading(true);
        try {
            const lat = coords.lat;
            const lng = coords.lng;
            const { north, south, east, west } = getBoundingCoordinates(lat, lng, 30);

            let url = `${API_BASE_URL}/api/locations/home-posts?north=${north}&south=${south}&east=${east}&west=${west}`;

            if (type === "WATER") {
                url = `${API_BASE_URL}/api/locations/home-posts/16?north=${north}&south=${south}&east=${east}&west=${west}`;
            } else if (type === "VIEW") {
                url = `${API_BASE_URL}/api/locations/home-posts/21?north=${north}&south=${south}&east=${east}&west=${west}`;
            }

            const response = await fetch(url, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error fetching home posts:", response.status, errorData);
            } else {
              const locationData = await response.json();
              setPostData(locationData);
            }

        } catch (error) {
            console.error("Error loading home posts:", error);
        } finally {
            setIsLoading(false); // Set loading to false whether successful or not
        }
    };

    useEffect(() => {
        if (coords.lat === 0 || coords.lng === 0) {
            console.log("No coords");
        } else {
          setLocationLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (locationLoaded && postType !== "FOLLOWING") {
            loadHomePosts(postType);
        }
    }, [locationLoaded]);

    useEffect(() => {
        if (userLoggedIn && postType === "FOLLOWING") {
            loadFollowing();
        }
    }, [userLoggedIn, modalOpened]);

    return (        
        <>
            {!isLoading && postData && (
                <>
                    {renderPosts(postData)}
                    {renderPagination(postData)}
                </>
            )}
        </>
    );
};

HomePostSection.propTypes = {
    postType: PropTypes.string.isRequired,
    coords: PropTypes.object
}

export default HomePostSection;