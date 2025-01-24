import "./login.css"
import { FcGoogle } from "react-icons/fc"
import { BsFacebook, BsApple } from "react-icons/bs"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// API functions -- being used for testing currently
// import signIn from "../../../api/users/signIn"
// import { useEffect, useState } from "react"

function Login () {
    const [ email, setEmail ] = useState();
    const [ password, setPassword ] = useState();

    const navigate = useNavigate();
    

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (response.ok) {
                const data = await response.json(); 
                console.log("Login successful!");
                console.log("Bearer Token:", data.accessToken);

                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
            else {
                console.error("Login failed: ", await response.text());
            }
        } catch (error) {
            console.error("Error during signup: ", error);
        }
    };

    return (
        <div className="page page__login">

                <div className="login-component">
                    

                    <h2 className="login-header">
                        Welcome.
                        <br></br>
                        Log in to find new spots.
                    </h2>

                    <form className="login-container" onSubmit={ handleLogin }>
                        <input
                            id="email-input-el"
                            className="login-container__input"
                            type="text"
                            name="email"
                            placeholder="Email address"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            id="password-input-el"
                            className="login-container__input"
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div>
                            <input className="login__btn" type="submit" value="Log in"></input>
                        </div>
                    </form>

                    <div className="atag__forgot-password">
                        <a href="/users/password/new"> <strong> Forgot your password? </strong> </a>
                    </div>

                    <div className="alternate-login">
                        <div className="btn-container">
                            <button className="login__btn google-btn" type="submit">
                                <span> <FcGoogle></FcGoogle> </span>
                                <span> Continue with Google </span>
                            </button>
                        </div>

                        <div className="btn-container">
                            <button className="login__btn facebook-btn" type="submit">
                                <span> <BsFacebook></BsFacebook> </span>
                                <span> Continue with Facebook </span>
                            </button>
                        </div>

                        <div className="btn-container">
                            <button className="login__btn apple-btn" type="submit">
                                <span> <BsApple></BsApple> </span>
                                <span> Continue with Apple </span>
                            </button>
                        </div>
                    </div>

                    <p className="no-account">
                        <span>Don&apos;t have an account?</span> <a href="/signup"> Sign up for free </a>
                    </p>

                    <p className="terms">By continuing to use ShareWhere, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>. Personal data added to ShareWhere is public by default — refer to our <span>Privacy FAQs</span> to make changes.</p>

                </div>

        </div>
    )
}

export default Login