import "./signupForm.css";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext/useAuth";
import { getLocation } from "../../../assets/helpers/getLocation";
import { FaArrowLeft } from "react-icons/fa";
// import { useUser } from "../userContext/useUser";

function SignupForm({ onBackToBasic }) {

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [passwordHash, setPasswordHash] = useState('');
    const [location, setLocation] = useState(null);
    const [latitude, setLatitude] = useState(0.0);
    const [longitude, setLongitude] = useState(0.0);
    const [city, setCity] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { setUserLoggedIn } = useAuth();
    const GEOCODE_API_KEY = "67a816ef92b15044102715dipdd6220";
    // const { setUserInfo } = useUser();
    

    const handleLocationPermission = async () => {
        try {
            const coords = await getLocation();
            setLocation(coords);
            console.log(coords);
            setLatitude(coords.lat);
            setLongitude(coords.lng);
            const response = await fetch(`https://geocode.maps.co/reverse?lat=${coords.lat}&lon=${coords.lng}&api_key=${GEOCODE_API_KEY}`, {
                method: "GET"
            });
            if (response.ok) {
                const data = await response.json(); 
                setCity(data.address.city);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    name,
                    email,
                    passwordHash,
                    latitude,
                    longitude
                }),
            });

            if (response.ok) {
                const data = await response.json(); 
                console.log("Bearer Token:", data.token);

                localStorage.setItem("jwtToken", data.token);
                localStorage.setItem("userData", data.user);
                localStorage.setItem("userId", JSON.parse(data.user.userId));
                localStorage.setItem("name", data.user.name);
                setUserLoggedIn(true);

                setTimeout(() => {
                    navigate("/");
                }, 1500);
            }
            else {
                console.error("Signup failed: ", await response.text());
            }
        } catch (error) {
            console.error("Error during signup: ", error);
        }
    };

    return (
        <div className="signup-modal-container">
            <div className="signup-back-btn-container">
                <button className="signup-form-back" onClick={ onBackToBasic }><FaArrowLeft /></button>
            </div>
            <h2 className="signup-form-header">Sign up to do some exploring</h2>
            <form
                className="signup-form-container"
                onSubmit={ handleSubmit }>
                <input
                    className="signup-form-input"
                    type="text"
                    placeholder="Name"
                    id="name"
                    name="name"
                    required
                    value = {name}
                    onChange={(e) => setName(e.target.value)}
                />
                <br />
                <input
                    className="signup-form-input"
                    type="text"
                    placeholder="Username"
                    id="username"
                    name="username"
                    required
                    value = {username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br/>
                <input
                    className="signup-form-input"
                    type="email"
                    placeholder="Email"
                    id="email"
                    name="email"
                    required
                    value = {email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br/>
                <input
                    className="signup-form-input"
                    type="password"
                    placeholder="Password"
                    id="password"
                    name="password"
                    required
                    value = {passwordHash}
                    onChange={(e) => setPasswordHash(e.target.value)}
                />
                <br/>
                <div className="location-container">
                    <p className="location-text">Location: 
                        {location ? (
                            <span>{city}</span> 
                        ) : (
                            <button type="button" className="location-btn" onClick={handleLocationPermission}>
                                Allow Location
                            </button>
                        )}
                    </p> 
                    {error && <p className="error">{error}</p>}
                </div>
                <br/>
                <input
                    disabled={
                        !(name !== "" &&
                          username !== "" &&
                          email !== "" &&
                          passwordHash !== "" && 
                          location !== null) 
                    }
                    className="signup-modal-btn"
                    type="submit"
                    value="Submit"
                />
            </form>
        </div>
    );
}

SignupForm.propTypes = {
    onBackToBasic: PropTypes.func.isRequired,
};

export default SignupForm