import "./forgotPassword.css";
import { useState, useEffect } from "react";
import UseAnimations from "react-useanimations";
import loading from 'react-useanimations/lib/loading';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); // Add a message state
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setIsSubmitted(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, { // Replace with your API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Recovery email sent successfully!"); // Display success message
        setIsSubmitted(false);
      } else {
        setMessage(data.error || "Failed to send recovery email. Please try again."); // Display error message
        setIsSubmitted(false);
      }
    } catch (error) {
      console.error("Error sending recovery email:", error);
      setMessage("An unexpected error occurred. Please try again later.");
      setIsSubmitted(false);
    }
  };

  return (
    <form className="forgot-password-container" onSubmit={handleSubmit}>
      <label htmlFor="forgot-email" className="forgot-label">
        Please enter your email and we will send you a recovery link
      </label>
      <input
        id="forgot-email"
        placeholder="Email"
        className="forgot-email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="message-container">
        {message &&
          <p className="message">{message}</p>
        }
      </div>
      <button disabled={isSubmitted} className="send-email-btn" type="submit">
        {isSubmitted ? (
            <UseAnimations animation={loading} size={25} />
        ) : (
            "Send reset link"
        )}
      </button>
    </form>
  );
};

export default ForgotPassword;