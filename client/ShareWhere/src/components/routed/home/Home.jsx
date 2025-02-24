import "./home.css";
import { useState, useEffect } from "react";
import useAuth from "../authContext/useAuth";
import HomePostSection from "../homePostSection/HomePostSection";

function Home() {
    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const { userLoggedIn } = useAuth();
    const nearby = "NEARBY";
    const following = "FOLLOWING";
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
                        <HomePostSection postType={nearby}/>
                    </div>
                    <hr />
                        {userLoggedIn && (
                            <div className="local-post-container">
                                <div className="local-favorites">
                                    <p className="favorites-title">
                                        Recents from your following
                                    </p>
                                </div>
                                    <HomePostSection postType={following}/>
                            </div>
                        )}
                        <div className="local-post-container">
                            <div className="local-favorites">
                                <p className="favorites-title">
                                    Great views
                                </p>
                            </div>
                        </div>
                        <hr />
                        <div className="local-post-container">
                            <div className="local-favorites">
                                <p className="favorites-title">
                                    If you want to go swimming
                                </p>
                            </div>
                        </div>
                </div>
              </> 
            );
}

export default Home;