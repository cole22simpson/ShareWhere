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
    const [location, setLocation] = useState('');
    const navigate = useNavigate();
    const { setUserLoggedIn } = useAuth();

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
                    location,
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
        <div>
            <button onClick={ onBackToBasic }>Back</button>
            <h2>Sign up to do some exploring</h2>
            <form onSubmit={ handleSubmit }>
                <input
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
                    type="password"
                    placeholder="Password"
                    id="password"
                    name="password"
                    required
                    value = {passwordHash}
                    onChange={(e) => setPasswordHash(e.target.value)}
                />
                <br/>
                <input
                    type="text"
                    placeholder="Location"
                    id="location"
                    name="location"
                    required
                    value = {location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <br/>
                <input type="submit" value="Submit"></input>
            </form>
        </div>
    );
}

SignupForm.propTypes = {
    onBackToBasic: PropTypes.func.isRequired,
};

export default SignupForm