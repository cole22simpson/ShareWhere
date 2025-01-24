import "./home.css"
// import {useState, useEffect} from "react"

function Home() {
    return (
      <>
        <div className="banner-container">
            <h1 className="greeting">
                Where to today, Cole?
            </h1>
            <form className="home-search-form">
                <input className="home-search-bar" type="search" placeholder="Search by city or name"></input>
            </form>
        </div>
      </> 
    );
}

export default Home