import "./home.css"
import {useState, useEffect} from "react"
import LocationModal from "../locationModal/LocationModal";
import HomePost from "../homePost/HomePost";


function Home() {

    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [homeData, setHomeData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasAccount, setHasAccount] = useState(false);

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

    const loadFollowing = async () => {

        setIsLoading(true);

        try {
            const userId = localStorage.getItem("userId");
            const response = await fetch(`http://localhost:8080/users/${userId}/following`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            });

            if (!response.ok) { // Check for errors first!
                const errorData = await response.json(); // Or response.text() for non-JSON errors
                console.error("Error fetching user:", response.status, errorData);
                return; // Or throw an error, or handle it as needed
            }
            
            try {
                const userData = await response.json(); // Extract the JSON data
                setHomeData(userData);
                console.log(userData);             
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
        loadFollowing();
    }, []);

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
            <form className="home-search-form">
                <input className="home-search-bar" type="search" placeholder="Search by city or name"></input>
            </form>
        </div>
        <div className="home-post-container">
            <div className="local-post-container">
                <div className="local-favorites">
                    <p className="favorites-title">
                        Local favorites near <span>{city}</span>
                    </p>
                    <a href="" className="home-see-more">
                        See more
                    </a>
                </div>
                <div className="local-posts">
                    <div className="local-post">
                        <a href="" className="local-post-container">
                            <img src="/assets/images/login-background.jpg" className="local-post-img"></img>
                            <h4 className="local-post-name">
                                Location name
                            </h4>
                        </a>
                    </div>

                    <div className="local-post">
                        <a href="" className="local-post-container">
                        <img src="/assets/images/login-background.jpg" className="local-post-img"></img>
                            <h4 className="local-post-name">
                                Location name
                            </h4>
                        </a>
                    </div>

                    <div className="local-post">
                        <a href="" className="local-post-container">
                        <img src="/assets/images/login-background.jpg" className="local-post-img"></img>
                            <h4 className="local-post-name">
                                Location name
                            </h4>
                        </a>
                    </div>

                    <div className="local-post">
                        <a href="" className="local-post-container">
                        <img src="/assets/images/login-background.jpg" className="local-post-img"></img>
                            <h4 className="local-post-name">
                                Location name
                            </h4>
                        </a>
                    </div>
                </div>
            </div>

            <div className="local-post-container">
                <div className="local-favorites">
                    <p className="favorites-title">
                        Recents from your following
                    </p>
                    <a href="" className="home-see-more">
                        See more
                    </a>
                </div>
                {!isLoading && (
                    <div className="home-posts">
                        {homeData.followingPosts.map((post) => (
                            <HomePost key={post.locationId} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </div>
      </> 
    );
}

export default Home