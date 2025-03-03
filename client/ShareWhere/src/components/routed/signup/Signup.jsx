import "./signup.css"
import { FcGoogle } from "react-icons/fc";
import { BsFacebook, BsApple } from "react-icons/bs";
import SignupForm from "../signupForm/SignupForm.jsx";
import { useState, useEffect } from "react";

function Signup () {
    const [showBasicForm, setShowBasicForm] = useState(false);
    const [backgroundImage, setBackgroundImage] = useState("");
    const [changeImages, setChangeImages] = useState(false);

    const handleBasicClick = () => {
        setShowBasicForm(true);
    };

    const handleBackToBasic = () => {
        setShowBasicForm(false); 
      };

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
            "url('/assets/images/tree-yosemite.PNG'",
            "url('/assets/images/mixed-chill.PNG'",
            "url('/assets/images/surf-paint.PNG'"
        ];
    
        const singleImages = [
            "url('/assets/images/yosemite-wall.JPG')",
            "url('/assets/images/tree-cave.jpg')",
            "url('/assets/images/budapest-view.jpg')",
            "url('/assets/images/joshua-tree.JPG')",
            "url('/assets/images/belgium-paint.jpg')",
            "url('/assets/images/hawaii.jpg')",
        ];
    
        const images = !changeImages ? splitImages : singleImages;

        const randomImage = images[Math.floor(Math.random() * images.length)];
        setBackgroundImage(randomImage);
    }, [changeImages]);

    return (
        <div
            className="page signup-page"
            style={{backgroundImage: backgroundImage}}>

            <div className="signup-component">

                {showBasicForm ? (
                    <SignupForm onBackToBasic={ handleBackToBasic } />
                ) : (
                    <>
                        <div className="signup-header-container">
                            <h2 className="signup-header">Create your free account</h2>
                        </div>
                            <div className="login-btn-container">
                                <div className="signup-btn google-btn" type="submit">
                                    <FcGoogle />&nbsp;Continue with Google - Disabled
                                </div>
                            </div>

                            <div className="signup-component-or">
                                <hr />
                                <p>or</p>
                                <hr />
                            </div>

                            <div className="login-btn-container">
                                <button className="signup-btn" onClick={handleBasicClick}  type="submit">
                                    <span> Create a free account </span>
                                </button>
                            </div>

                            <p className="no-account">
                                <span>Already have an account?</span> <a href="/login">Log in</a>
                            </p>
                    </>
                )}

                <p className="terms">By continuing to use ShareWhere, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>. Personal data added to ShareWhere is public by default — refer to our <span>Privacy FAQs</span> to make changes.</p>
                
            </div>

        </div>
    )
}

export default Signup