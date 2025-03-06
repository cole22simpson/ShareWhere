import "./editModal.css";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import imageCompression from 'browser-image-compression';

const EditModal = ({ username, name, bio, profilePicUrl, backToProfile }) => {

    const [newImage, setNewImage] = useState(null);
    const [newName, setNewName] = useState(name);
    const [newUsername, setNewUsername] = useState(username);
    const [newBio, setNewBio] = useState(bio);
    const [imageURL, setImageURL] = useState(profilePicUrl);
    const [imageUploaded, setImageUploaded] = useState(false);
    const [isSaveDisabled, setIsSaveDisabled] = useState(false);
    const [errors, setErrors] = useState({});
    const [usernameError, setUsernameError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 500,
                    useWebWorker: true,
                };
                const compressedFile = await imageCompression(file, options);
                setNewImage(compressedFile);
                setImageURL(URL.createObjectURL(compressedFile));
                setImageUploaded(true);
            } catch (error) {
                console.error("Error during image compression: ", error);
            }
        }
    };
    

    const handleCharCount = (e, maxLength) => `${e.target.value.length} / ${maxLength}`;

    useEffect(() => {
        setIsSaveDisabled(newName.length < 3 || newUsername.length < 3);
    }, [newName, newUsername]);

    const handleSubmitChanges = async (event) => {
        event.preventDefault();
    
        setErrors({});
        setNameError(false);
        setUsernameError(false);
    
        const user_id = localStorage.getItem("userId");
        let hasErrors = false; // Flag to track if any errors occurred
    
        if (newName !== name || newUsername !== username) {
            const lowerUsername = newUsername.toLowerCase();
            const formData = new FormData();
            formData.append("new_name", newName);
            formData.append("new_username", lowerUsername);
    
            try {
                const response = await fetch(`${API_BASE_URL}/api/users/${user_id}/names`, {
                    method: "PATCH",
                    credentials: "include",
                    body: formData
                });
    
                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem("name", data.name);
                    localStorage.setItem("userData", data.user);
                } else {
                    hasErrors = true; // Set the flag if there's an error
                    const errors = await response.json();
                    if (errors) {
                        setErrors(errors);
                    } else {
                        console.error("Edit failed: ", response.status, response.statusText); // Include status code/text
                        // Optionally, set a general error message if no JSON is returned:
                        setErrors({ general: "Error updating name/username." }); 
                    }
                }
            } catch (error) {
                hasErrors = true; // Set the flag if there's an error
                console.error("Error during user update: ", error);
                setErrors({ general: "A network error occurred." }); //  Set a general error message
            }
        }
    
        if (newBio !== bio || newImage) {
            const formData = new FormData();
            formData.append("new_bio", newBio);
            formData.append("new_image", newImage);
    
            try {
                const response = await fetch(`${API_BASE_URL}/api/users/${user_id}/profile`, {
                    method: "PATCH",
                    credentials: "include",
                    body: formData
                });
    
                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem("userData", data.user);
                } else {
                    hasErrors = true; // Set the flag if there's an error
                    const errorText = await response.text();
                    console.error("Profile update failed: ", response.status, response.statusText, errorText); // Include status/text and error
                    // Set a general error or parse the error text if it's JSON
                    try {
                        const errors = JSON.parse(errorText); // Attempt to parse JSON error
                        setErrors({...errors}); // Spread the errors into existing error state
                    } catch {
                        setErrors({ general: "Error updating profile." }); // General error if not JSON
                    }
                }
            } catch (error) {
                hasErrors = true; // Set the flag if there's an error
                console.error("Error during profile update: ", error);
                setErrors({ general: "A network error occurred." }); // Set a general error message
            }
        }
    
        if (!hasErrors) { // Only close if NO errors were encountered
            backToProfile();
        }
    };

    useEffect(() => {
        const textarea = document.querySelector('.attribute textarea');

        const handleInput = () => {
            if (textarea.scrollHeight > textarea.clientHeight) {
                textarea.value = textarea.value.slice(0, -1);
            }
        };

        if (textarea) {
            textarea.addEventListener('input', handleInput);

            return () => {
                textarea.removeEventListener('input', handleInput);
            };
        }
    }, []);

    useEffect(() => {
        if (errors.name) {
            setNameError(true);
        }
        if (errors.username) {
            setUsernameError(true);
        }
    }, [errors]);

    return (
        <div className="edit-modal-container">

            <div className="btn-container">
                <button className="cancel" onClick={backToProfile}>Cancel changes</button>
            </div>

            <div className="change-profile-pic">
                { imageUploaded ? (
                    <img className="profile-pic" src={imageURL}></img>
                ) : (
                    <img className="profile-pic" src={profilePicUrl}></img>
                )}
                <input
                    id="profile-pic"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    hidden
                />
                <label className="change-btn" htmlFor="profile-pic">Change profile pic</label>
            </div>

            <div className="attribute-container">
                <div className="attribute">
                    <label htmlFor="username">Username: </label>
                    <div className="column">
                        <input
                            id="username"
                            className={`edit-profile-input ${usernameError ? "input-error" : ""}`}
                            minLength={3}
                            maxLength={30}
                            placeholder={username}
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}    
                        />
                        <div className="profile-modal-bottom">
                            <p className={`error-container profile-error ${usernameError ? "shown" : ""}`}>{errors.username}</p>
                            <p className="count">{handleCharCount({ target: { value: newUsername } }, 30)}</p>
                        </div>
                    </div>
                </div>
                <div className="attribute">
                    <label htmlFor="name">Name: </label>
                    <div className="column">
                        <input
                            id="name"
                            value={newName}
                            className={`edit-profile-input ${nameError ? "input-error" : ""}`}
                            minLength={3}
                            maxLength={30}
                            placeholder={name}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <div className="profile-modal-bottom">
                            <p className={`error-container profile-error ${nameError ? "shown" : ""}`}>{errors.name}</p>
                            <p className="count">{handleCharCount({ target: { value: newName } }, 30)}</p>
                        </div>
                    </div>
                </div>
                <div className="attribute">
                    <label htmlFor="bio">Bio: </label>
                    <div className="column">
                        <textarea
                            id="bio"
                            value={newBio}
                            maxLength={150}
                            placeholder={bio}
                            onChange={(e) => setNewBio(e.target.value)}
                        />
                        <p className="count">{handleCharCount({ target: { value: newBio } }, 150)}</p>
                    </div>
                </div>
                <button className="cancel save"  onClick={handleSubmitChanges}>Save changes</button>
            </div>
        </div>
    );
}

EditModal.propTypes = {
    username: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    profilePicUrl: PropTypes.string.isRequired,
    backToProfile: PropTypes.func.isRequired,
};

export default EditModal;