import "./editModal.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const EditModal = ({ username, name, bio, profilePicUrl, backToProfile }) => {

    const [newImage, setNewImage] = useState(null);
    const [newName, setNewName] = useState(name);
    const [newUsername, setNewUsername] = useState(username);
    const [newBio, setNewBio] = useState(bio);
    const [imageURL, setImageURL] = useState(profilePicUrl);
    const [imageUploaded, setImageUploaded] = useState(false);
    const [isSaveDisabled, setIsSaveDisabled] = useState(false);
    const navigate = useNavigate();

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImage(file);
            setImageURL(URL.createObjectURL(file));
            setImageUploaded(true);
        }
    };

    const handleCharCount = (e, maxLength) => `${e.target.value.length} / ${maxLength}`;

    useEffect(() => {
        setIsSaveDisabled(newName.length < 3 || newUsername.length < 3);
    }, [newName, newUsername]);

    const handleSubmitChanges = async () => {
        const userId = localStorage.getItem("userId");

        if (newName !== name || newUsername !== username) {

            const lowerUsername = newUsername.toLowerCase();

            const formData = new FormData();

            formData.append("newName", newName);
            formData.append("newUsername", lowerUsername);

            try {
                const response = await fetch(`http://localhost:8080/users/${userId}/names`, {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                    },
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json(); 
                    localStorage.setItem("name", data.name);
                    localStorage.setItem("userData", data.user);
                }
                else {
                    console.error("User update failed: ", await response.text());
                }
            } catch (error) {
                console.error("Error during user update: ", error);
            }
        }

        if (newBio !== bio || newImage) {

            const formData = new FormData();

            formData.append("newBio", newBio);
            formData.append("newImage", newImage);

            try {
                const response = await fetch(`http://localhost:8080/users/${userId}/profile`, {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                    },
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json(); 
                    localStorage.setItem("userData", data.user);
                }
                else {
                    console.error("Profile update failed: ", await response.text());
                }
            } catch (error) {
                console.error("Error during profile update: ", error);
            }
        }

        backToProfile();
        window.location.reload();
    }

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
                            minLength={3}
                            maxLength={30}
                            placeholder={username}
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}    
                        />
                        <p className="count">{handleCharCount({ target: { value: newUsername } }, 30)}</p>
                    </div>
                </div>
                <div className="attribute">
                    <label htmlFor="name">Name: </label>
                    <div className="column">
                        <input
                            id="name"
                            value={newName}
                            minLength={3}
                            maxLength={30}
                            placeholder={name}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <p className="count">{handleCharCount({ target: { value: newName } }, 30)}</p>
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
                <button className="cancel save" disabled={isSaveDisabled} onClick={handleSubmitChanges}>Save changes</button>
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