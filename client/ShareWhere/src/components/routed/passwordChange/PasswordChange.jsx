import "./passwordChange.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import UseAnimations from "react-useanimations";
import loading from 'react-useanimations/lib/loading';

const PasswordChange = () => {
  const [changeImages, setChangeImages] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState("password");
  const [message, setMessage] = useState(""); // For feedback messages
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const { token } = useParams(); // Extract the token from the URL

  useEffect(() => {
    function handleResize() {
      setChangeImages(window.innerWidth < 600);
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const splitImages = [
      "url('/assets/images/login-background.PNG'",
      "url('/assets/images/mixed-nature.PNG'",
      "url('/assets/images/mixed-sunsets.PNG'",
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

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setIsSubmitted(true);

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsSubmitted(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password/${token}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Password changed successfully!");
        console.alert("Password changed successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setMessage(data.error || "Failed to change password. Please try again.");
        setIsSubmitted(false);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage("An unexpected error occurred. Please try again later.");
      setIsSubmitted(false);
    }
  };

  return (
    <div
      className="page page-login"
      style={{ backgroundImage: backgroundImage }}
    >
      <div className="password-change-container">
        <p className="change-password-title">
            Choose your new password
        </p>
        <form className="password-change-inputs" onSubmit={handleSubmit}>
            <label htmlFor="new-password" >Enter your new password</label>
            <input
                id="new-password"
                type={showPassword}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <div className="show-password">
                {showPassword === "password" ? (
                    <FaRegEyeSlash className="eyeball1" onClick={() => setShowPassword("text")} />
                ) : (
                    <FaRegEye className="eyeball1" onClick={() => setShowPassword("password")} />
                )}
            </div>
            <label htmlFor="confirm-password" >Confirm your new password</label>
            <input
                id="confirm-password"
                type={showPassword}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
            <div className="show-password">
                {showPassword === "password" ? (
                    <FaRegEyeSlash className="eyeball2" onClick={() => setShowPassword("text")} />
                ) : (
                    <FaRegEye className="eyeball2" onClick={() => setShowPassword("password")} />
                )}
            </div>
            <div className="message-container">
              {message && <p className="message">{message}</p>}
            </div>
          <button className="change-password-btn" disabled={isSubmitted} type="submit">
            {isSubmitted ? (
                <UseAnimations animation={loading} size={25} />
            ) : (
                "Change password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordChange;