import "./signupForm.css";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext/useAuth";

function SignupForm({ onBackToBasic }) {

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [passwordHash, setPasswordHash] = useState('');
    const [location, setLocation] = useState(null);
    const [latitude, setLatitude] = useState(0.0);
    const [longitude, setLongitude] = useState(0.0);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { setUserLoggedIn } = useAuth();

    const handleLocationPermission = async () => {
        try {
            const permission = await navigator.permissions.query({ name: 'geolocation' });

            if (permission.state === 'granted') {
                navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setLatitude(lat);
                    setLongitude(lng);
                    console.log("Lat: ", lat);
                    console.log("Lng: ", lng);
                    setLocation({ lat: lat, lng: lng });
                },
                (error) => {
                    setError("Error getting location. Please try again."), error;
                }
                );
            } else if (permission.state === 'denied') {
                setError("Location access denied. Please enable location services in your browser settings.")
            } else if (permission.state === 'prompt') {
                if (window.confirm("Would you like to share your location?")) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const lat = position.coords.latitude;
                            const lng = position.coords.longitude;
                            setLatitude(lat);
                            setLongitude(lng);
                            console.log("Lat: ", lat);
                            console.log("Lng: ", lng);
                            setLocation({ lat: lat, lng: lng });
                        },
                        (error) => {
                            setError("Error getting location. Please try again."), error;
                        }
                    );
                }
            }
            } catch (error) {
            console.error(error);
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
                console.log("Signup successful!");
                console.log("Bearer Token:", data.token);

                localStorage.setItem("jwtToken", data.token);
                setUserLoggedIn(true);

                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
            else {
                console.error("Signup failed: ", await response.text());
            }
        } catch (error) {
            console.error("Error during signup: ", error);
        }
    };

    return (
        <>
            <button onClick={ onBackToBasic }>Back</button>
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
                <div>
                    {location ? (
                    <p>Location: {latitude}, {longitude}</p> 
                    ) : (
                    <button type="button" className="signup-form-btn" onClick={handleLocationPermission}>Allow Location</button>
                    )}
                    {error && <p className="error">{error}</p>}
                </div>
                <br/>
                <input className="signup-form-btn" type="submit" value="Submit"></input>
            </form>
        </>
    );
}

SignupForm.propTypes = {
    onBackToBasic: PropTypes.func.isRequired,
};

export default SignupForm