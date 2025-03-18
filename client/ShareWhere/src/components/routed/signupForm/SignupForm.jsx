import "./signupForm.css";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useAuth } from "../authContext/useAuth";
import { getLocation } from "../../../assets/helpers/getLocation";
import UseAnimations from "react-useanimations";
import loading from 'react-useanimations/lib/loading';
import { FaArrowLeft } from "react-icons/fa";
// import { useUser } from "../userContext/useUser";

function SignupForm({ onBackToBasic }) {

    const [name, setName] = useState('');
    const [rawUsername, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [passwordHash, setPasswordHash] = useState('');
    const [location, setLocation] = useState(null);
    const [latitude, setLatitude] = useState(0.0);
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const [longitude, setLongitude] = useState(0.0);
    const [errors, setErrors] = useState({});
    const [nameError, setNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState("password");
    const [city, setCity] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();
    const { userLoggedIn, setUserLoggedIn } = useAuth();
    const GEOCODE_API_KEY = import.meta.env.VITE_GEOCODE_API;

    const handleLocationPermission = async () => {
        try {
            const data = await getLocation();
            let latResponse;
            let lngResponse;
            if (data.city) {
                setLocation(data.latitude, data.longitude);
                setLatitude(data.latitude);
                latResponse = data.latitude;
                setLongitude(data.longitude);
                lngResponse = data.longitude;
            } else {
                setLocation(data);
                setLatitude(data.lat);
                latResponse = data.lat;
                setLongitude(data.lng);
                lngResponse = data.lng;
            }
            const response = await fetch(`https://geocode.maps.co/reverse?lat=${latResponse}&lon=${lngResponse}&api_key=${GEOCODE_API_KEY}`, {
                method: "GET"
            });
            if (response.ok) {
                const data = await response.json(); 
                if (data.address.city) {
                    setCity(data.address.city);
                }
                else if (data.address.town) {
                    setCity(data.address.town);
                }
                else if (data.address.village) {
                    setCity(data.address.village);
                }
                else if (data.address.county) {
                    setCity(data.address.county);
                }
                else if (data.address.state) {
                    setCity(data.address.state);
                }
                else if (data.address.country) {
                    setCity(data.address.country);
                }
            }
            localStorage.setItem('coords', JSON.stringify({ lat: latResponse, lng: lngResponse }));
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitted(true);
        setErrors({});
        setEmailError(false);
        setNameError(false);
        setUsernameError(false);
        setPasswordError(false);

        const username = rawUsername.toLowerCase();

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    username,
                    name,
                    email,
                    passwordHash,
                    latitude,
                    longitude,
                    city
                }),
            });

            if (response.ok) {
                const data = await response.json(); 

                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("userId", JSON.parse(data.user.userId));
                localStorage.setItem("name", data.user.name);
                localStorage.setItem("city", data.user.city);

                setUserLoggedIn(true);
                setTimeout(() => {
                    navigate("/");
                }, 1500);
            }
            else {
                const errorData = await response.json();
                if (errorData.errors && typeof errorData.errors === "object") {
                    setErrors(errorData.errors); // Update state with field-specific errors
                } else {
                    console.error("Signup failed: ", errorData.message || "Unknown error");
                }
                setIsSubmitted(false);
            }
        } catch (error) {
            console.error("Error during signup: ", error);
            setIsSubmitted(false);
        }
    };

    useEffect(() => {
        if (errors.name) {
            setNameError(true);
        }
        if (errors.username) {
            setUsernameError(true);
        }
        if (errors.email) {
            setEmailError(true);
        }
        if (errors.password) {
            setPasswordError(true);
        }
    }, [errors]);

    return (
        <div className="signup-modal-container">
            <div className="signup-back-btn-container">
                <button className="signup-form-back" onClick={ onBackToBasic }><FaArrowLeft /></button>
            </div>
            <p className="signup-form-header">Sign up to do some exploring</p>
            <form
                className="signup-form-container"
                onSubmit={ handleSubmit }>
                <input
                    className={`signup-form-input ${nameError ? "input-error" : ""}`}
                    type="text"
                    placeholder="Name"
                    id="name"
                    name="name"
                    required
                    value = {name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div className="error-container">
                    <p className={`error ${nameError ? "shown" : ""}`}>{errors.name}</p>
                </div>
                <input
                    className={`signup-form-input ${usernameError ? "input-error" : ""}`}
                    type="text"
                    placeholder="Username"
                    id="username"
                    name="username"
                    required
                    value = {rawUsername}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <div className="error-container">
                    <p className={`error ${usernameError ? "shown" : ""}`}>{errors.username}</p>
                </div>
                <input
                    className={`signup-form-input ${emailError ? "input-error" : ""}`}
                    type="text"
                    placeholder="Email"
                    id="email"
                    name="email"
                    required
                    value = {email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="error-container">
                    <p className={`error ${emailError ? "shown" : ""}`}>{errors.email}</p>
                </div>
                <div className="password-input-container">
                    <input
                        className={`signup-form-input ${passwordError ? "input-error" : ""}`}
                        type={showPassword}
                        placeholder="Password"
                        id="password"
                        name="password"
                        required
                        value = {passwordHash}
                        onChange={(e) => setPasswordHash(e.target.value)}
                    />
                    <div className="show-password">
                        {showPassword === "password" ? (
                            <FaRegEyeSlash className="eyeball" onClick={() => setShowPassword("text")} />
                        ) : (
                            <FaRegEye className="eyeball" onClick={() => setShowPassword("password")} />
                        )}
                    </div>
                </div>
                <div className="error-container">
                    <p className={`error ${passwordError ? "shown" : ""}`}>{errors.password}</p>
                </div>
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
                </div>
                {errors.location && <p className="error">{errors.location}</p>}
                <button
                    className="signup-modal-btn"
                    type="submit"
                    disabled={
                        isSubmitted || // Disable if already submitted
                        !(name !== "" &&
                        rawUsername !== "" &&
                        email !== "" &&
                        passwordHash !== "" &&
                        location !== null)
                    }
                    >
                        {isSubmitted ? (
                            <UseAnimations animation={loading} size={25} />
                        ) : (
                            "Submit"
                        )}
                </button>
            </form>
        </div>
    );
}

SignupForm.propTypes = {
    onBackToBasic: PropTypes.func.isRequired,
};

export default SignupForm