import "./signup.css"
import { FcGoogle } from "react-icons/fc";
import { BsFacebook, BsApple } from "react-icons/bs";
import SignupForm from "../signupForm/SignupForm.jsx";
import { useState, useEffect } from "react";

function Signup () {
    const [showBasicForm, setShowBasicForm] = useState(false);
    const [backgroundImage, setBackgroundImage] = useState("");

    const handleBasicClick = () => {
        setShowBasicForm(true);
    };

    const handleBackToBasic = () => {
        setShowBasicForm(false); 
      };

    // const images = [
    //     "url('/assets/images/tree-yosemite.PNG'",
    //     "url('/assets/images/mixed-chill.PNG'",
    //     "url('/assets/images/surf-paint.PNG'"
    // ]

    useEffect(() => {

        const images = [
            "url('/assets/images/tree-yosemite.PNG'",
            "url('/assets/images/mixed-chill.PNG'",
            "url('/assets/images/surf-paint.PNG'"
        ]

        const randomImage = images[Math.floor(Math.random() * images.length)];
        setBackgroundImage(randomImage);
    }, []);

    return (
        <div
            className="page signup-page"
            style={{backgroundImage: backgroundImage}}>

            <div className="signup-component">

                {showBasicForm ? (
                    <SignupForm onBackToBasic={ handleBackToBasic } />
                ) : (
                    <>
                        <h2 className="signup-header">Create your free account</h2>
                        
                            <div className="alternate-auth">
                                <div className="btn-container">
                                    <button className="signup-btn google-btn" type="submit">
                                        <span> <FcGoogle></FcGoogle> </span>
                                        <span> Continue with Google </span>
                                    </button>
                                </div>

                                <div className="btn-container">
                                    <button className="signup-btn facebook-btn" type="submit">
                                        <span> <BsFacebook></BsFacebook> </span>
                                        <span> Continue with Facebook </span>
                                    </button>
                                </div>

                                <div className="btn-container">
                                    <button className="signup-btn apple-btn" type="submit">
                                        <span> <BsApple></BsApple> </span>
                                        <span> Continue with Apple </span>
                                    </button>
                                </div>
                            </div>

                            <div className="signup-component__or">
                                <hr />
                                <p>or</p>
                                <hr />
                            </div>

                            <div className="btn-container">
                                <button className="signup-btn" onClick={handleBasicClick}  type="submit">
                                    <span> Create a free account </span>
                                </button>
                            </div>

                            <br></br>

                            <p className="no-account">
                                <span>Already have an account?</span> <a href="/login"> Log in </a>
                            </p>
                    </>
                )}

                <p className="terms">By continuing to use ShareWhere, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>. Personal data added to ShareWhere is public by default — refer to our <span>Privacy FAQs</span> to make changes.</p>
                
            </div>

        </div>
    )
}

export default Signup