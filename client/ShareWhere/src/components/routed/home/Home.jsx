import "./home.css"
import {useState, useEffect} from "react"
import HomePost from "../homePost/HomePost";
import { IoBookmark  } from "react-icons/io5";
import { BsPersonPlusFill } from "react-icons/bs";

function Home() {

    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [homeData, setHomeData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpened, setModalOpened] = useState(false);
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
        if (loggedIn) {
        loadFollowing();
        }
    }, []);

    useEffect(() => {
        if (loggedIn) {
        loadFollowing();
        }
    }, [modalOpened]);

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
                    <div className="home-post">
                        <div className="home-post-poster">
                            <img src="/assets/images/default-image.png" />
                            <p>cole22simpson</p>
                            <div></div>
                        </div>
                        <img src="/assets/images/tree-yosemite.PNG" className="home-post-img"></img>
                        <div className="home-post-info">
                            <div className="home-post-data">
                                <p className="home-post-name">LocationZ</p>
                                <p className="home-post-city">Poway</p>
                                <p className="home-post-saves"><IoBookmark/>10</p>
                            </div>
                        </div>
                    </div>
                    <div className="home-post">
                        <div className="home-post-poster">
                            <img src="/assets/images/default-image.png" />
                            <p>cole22simpson</p>
                            <div></div>
                        </div>
                        <img src="/assets/images/tree-yosemite.PNG" className="home-post-img"></img>
                        <div className="home-post-info">
                            <div className="home-post-data">
                                <p className="home-post-name">LocationZ</p>
                                <p className="home-post-city">Poway</p>
                                <p className="home-post-saves"><IoBookmark/>10</p>
                            </div>
                        </div>
                    </div>
                    <div className="home-post">
                        <div className="home-post-poster">
                            <img src="/assets/images/default-image.png" />
                            <p>cole22simpson</p>
                            <div></div>
                        </div>
                        <img src="/assets/images/tree-yosemite.PNG" className="home-post-img"></img>
                        <div className="home-post-info">
                            <div className="home-post-data">
                                <p className="home-post-name">LocationZ</p>
                                <p className="home-post-city">Poway</p>
                                <p className="home-post-saves"><IoBookmark/>10</p>
                            </div>
                        </div>
                    </div>
                    <div className="home-post">
                        <div className="home-post-poster">
                            <img src="/assets/images/default-image.png" />
                            <p>cole22simpson</p>
                            <div></div>
                        </div>
                        <img src="/assets/images/tree-yosemite.PNG" className="home-post-img"></img>
                        <div className="home-post-info">
                            <div className="home-post-data">
                                <p className="home-post-name">LocationZ</p>
                                <p className="home-post-city">Poway</p>
                                <p className="home-post-saves"><IoBookmark/>10</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
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
                    <>
                    {homeData.followingPosts.length > 0 ? (
                    <div className="home-posts">
                        {homeData.followingPosts.map((post) => (
                            <HomePost key={post.locationId} post={post} setModalOpened={setModalOpened} />
                        ))}
                    </div>
                    ) : (
                        <div className="no-following">
                            You don&apos;t follow anyone yet&nbsp;<BsPersonPlusFill/>
                        </div>
                    )}
                    </>
                )}
            </div>
            <hr />
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
                    <div className="home-post">
                        <div className="home-post-poster">
                            <img src="/assets/images/default-image.png" />
                            <p>cole22simpson</p>
                            <div></div>
                        </div>
                        <img src="/assets/images/tree-yosemite.PNG" className="home-post-img"></img>
                        <div className="home-post-info">
                            <div className="home-post-data">
                                <p className="home-post-name">LocationZ</p>
                                <p className="home-post-city">Poway</p>
                                <p className="home-post-saves"><IoBookmark/>10</p>
                            </div>
                        </div>
                    </div>
                    <div className="home-post">
                        <div className="home-post-poster">
                            <img src="/assets/images/default-image.png" />
                            <p>cole22simpson</p>
                            <div></div>
                        </div>
                        <img src="/assets/images/tree-yosemite.PNG" className="home-post-img"></img>
                        <div className="home-post-info">
                            <div className="home-post-data">
                                <p className="home-post-name">LocationZ</p>
                                <p className="home-post-city">Poway</p>
                                <p className="home-post-saves"><IoBookmark/>10</p>
                            </div>
                        </div>
                    </div>
                    <div className="home-post">
                        <div className="home-post-poster">
                            <img src="/assets/images/default-image.png" />
                            <p>cole22simpson</p>
                            <div></div>
                        </div>
                        <img src="/assets/images/tree-yosemite.PNG" className="home-post-img"></img>
                        <div className="home-post-info">
                            <div className="home-post-data">
                                <p className="home-post-name">LocationZ</p>
                                <p className="home-post-city">Poway</p>
                                <p className="home-post-saves"><IoBookmark/>10</p>
                            </div>
                        </div>
                    </div>
                    <div className="home-post">
                        <div className="home-post-poster">
                            <img src="/assets/images/default-image.png" />
                            <p>cole22simpson</p>
                            <div></div>
                        </div>
                        <img src="/assets/images/tree-yosemite.PNG" className="home-post-img"></img>
                        <div className="home-post-info">
                            <div className="home-post-data">
                                <p className="home-post-name">LocationZ</p>
                                <p className="home-post-city">Poway</p>
                                <p className="home-post-saves"><IoBookmark/>10</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </> 
    );
}

export default Home