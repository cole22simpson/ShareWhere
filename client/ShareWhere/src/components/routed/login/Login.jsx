import "./login.css"
import { FcGoogle } from "react-icons/fc"
import { useState, useEffect } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext/useAuth";
import { getLocation } from "../../../assets/helpers/getLocation";
import UseAnimations from "react-useanimations";
import loading from 'react-useanimations/lib/loading';
import ForgotPassword from "../forgotPassword/ForgotPassword";
// import { useUser } from "../userContext/useUser";

function Login () {
    const [ email, setEmail ] = useState("");
    const [error, setError] = useState(false);
    const [ password, setPassword ] = useState("");
    const [showPassword, setShowPassword] = useState("password");
    const { userLoggedIn, setUserLoggedIn } = useAuth();
    const [backgroundImage, setBackgroundImage] = useState("");
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [changeImages, setChangeImages] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        function handleResize() {
            setChangeImages(window.innerWidth < 600);
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {

        const splitImages = [
            "url('/assets/images/login-background.PNG'",
            "url('/assets/images/mixed-nature.PNG'",
            "url('/assets/images/mixed-sunsets.PNG'"
        ];
    
        const singleImages = [
            "url('/assets/images/sunset-cliff.jpg')",
            "url('/assets/images/bird-sunset.jpg')",
            "url('/assets/images/scotland-park.jpg')",
            "url('/assets/images/surf-river.jpg')",
            "url('/assets/images/kings-canyon.JPG')",
        ];
    
        const images = !changeImages ? splitImages : singleImages;

        const randomImage = images[Math.floor(Math.random() * images.length)];
        setBackgroundImage(randomImage);
    }, [changeImages]);
    

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsSubmitted(true);
        setError(false);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Ensures cookies are sent/received
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
    
            if (response.ok) {
                const data = await response.json(); 
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("userId", data.user.userId);
                localStorage.setItem("name", data.user.name);
                localStorage.setItem("city", data.user.city);
                setUserLoggedIn(true);
                setTimeout(() => {
                    navigate("/");
                }, 1500);
            }
            else if (response.status === 401) {
                console.error("Unauthorized: Invalid email or password.");
                setError(true);
                setIsSubmitted(false);
            }
            else {
                console.error("Login failed: ", await response.text());
                setError(true);
                setIsSubmitted(false);
            }
        } catch (error) {
            console.error("Error during login: ", error);
            setError(true);
            setIsSubmitted(false);
        }
    };
    

    return (
        <div
            className="page page-login"
            style={{backgroundImage: backgroundImage}}
        >
            {!forgotPassword ? (
                <div className="login-component">
                    <>
                        <h2 className="login-header">
                            Welcome.
                            <br></br>
                            Log in to find new spots.
                        </h2>
                        <form className="login-container" onSubmit={ handleLogin }>
                            <input
                                id="email-input-el"
                                className={`login-container-input ${error ? "input-error" : ""}`}
                                type="text"
                                name="email"
                                placeholder="Email address"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <div className="password-input-container">
                                <input
                                    id="password-input-el"
                                    className={`login-container-input ${error ? "input-error" : ""}`}
                                    type={showPassword}
                                    name="password"
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="show-password">
                                    {showPassword === "password" ? (
                                        <FaRegEyeSlash className="eyeball" onClick={() => setShowPassword("text")} />
                                    ) : (
                                        <FaRegEye className="eyeball" onClick={() => setShowPassword("password")} />
                                    )}
                                </div>
                            </div>
                            <div className="login-error-container">
                                <p className={`error ${error ? "shown" : ""}`}>Email or password does not match. Please try again.</p>
                            </div>
                            <div className="login-btn-container">
                            <button className="login-btn" disabled={isSubmitted} type="submit">
                                {isSubmitted ? (
                                    <UseAnimations animation={loading} size={25} />
                                ) : (
                                    "Log in"
                                )}
                            </button>
                            </div>
                        </form>
                        <div className="atag-forgot-password" onClick={() => setForgotPassword(true)}>
                            <strong> Forgot your password? </strong>
                        </div>
                        <div className="alternate-login">
                            <div className="login-btn-container">
                                <div className="login-btn google-btn" type="submit">
                                    <FcGoogle />&nbsp;Continue with Google - Disabled
                                </div>
                            </div>
                        </div>
                        <p className="no-account">
                            <span>Don&apos;t have an account?</span> <a href="/signup"> Sign up for free </a>
                        </p>
                        <p className="terms">By continuing to use ShareWhere, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>. Personal data added to ShareWhere is public by default — refer to our <span>Privacy FAQs</span> to make changes.</p>
                    </>
                </div>
            ) : (
                <ForgotPassword />
            )}

        </div>
    )
}

export default Login