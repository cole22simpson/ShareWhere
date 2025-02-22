import "./signupForm.css";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useAuth } from "../authContext/useAuth";
import { getLocation } from "../../../assets/helpers/getLocation";
import { FaArrowLeft } from "react-icons/fa";
// import { useUser } from "../userContext/useUser";

function SignupForm({ onBackToBasic }) {

    const [name, setName] = useState('');
    const [rawUsername, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [passwordHash, setPasswordHash] = useState('');
    const [location, setLocation] = useState(null);
    const [latitude, setLatitude] = useState(0.0);
    const [longitude, setLongitude] = useState(0.0);
    const [errors, setErrors] = useState({});
    const [nameError, setNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState("password");
    const [city, setCity] = useState("");
    const navigate = useNavigate();
    const { setUserLoggedIn } = useAuth();
    const GEOCODE_API_KEY = import.meta.env.VITE_GEOCODE_API;
    // const { setUserInfo } = useUser();
    

    const handleLocationPermission = async () => {
        try {
            const coords = await getLocation();
            setLocation(coords);
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
            console.error(error.message);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});
        setEmailError(false);
        setNameError(false);
        setUsernameError(false);
        setPasswordError(false);

        const username = rawUsername.toLowerCase();

        console.log(
            username, name, email, passwordHash, latitude, longitude, city
        );

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
                    longitude,
                    city
                }),
            });

            if (response.ok) {
                const data = await response.json(); 

                localStorage.setItem("jwtToken", data.token);
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
            }
        } catch (error) {
            console.error("Error during signup: ", error);
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
                <br />
                <input
                    disabled={
                        !(name !== "" &&
                          rawUsername !== "" &&
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