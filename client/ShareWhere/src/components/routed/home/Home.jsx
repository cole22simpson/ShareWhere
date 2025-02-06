import "./home.css"
import {useState, useEffect} from "react"


function Home() {

    const name = localStorage.getItem("name");


    return (
      <>
        <div className="banner-container">
            <h1 className="greeting">
                Where to today, {name}?
            </h1>
            <form className="home-search-form">
                <input className="home-search-bar" type="search" placeholder="Search by city or name"></input>
            </form>
        </div>
        <div className="home-post-container">
            <div className="local-post-container">
                <div className="local-favorites">
                    <h2 className="favorites-title">
                        Local favorites near <span>San Diego</span>
                    </h2>
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