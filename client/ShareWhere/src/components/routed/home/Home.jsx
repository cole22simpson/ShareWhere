import "./home.css"
import {useState, useEffect} from "react"



function Home() {

    const [name, setName] = useState("");
    const [city, setCity] = useState("");
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
        </div>
      </> 
    );
}

export default Home