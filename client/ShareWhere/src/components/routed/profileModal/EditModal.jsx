import "./editModal.css";
import { useState } from "react";
import PropTypes from "prop-types";

const EditModal = ({ username, name, bio, profilePicType, profilePicData, backToProfile }) => {

    const [imageType, setImageType] = useState(profilePicType);
    const [imageData, setImageData] = useState(profilePicData);
    const [image, setImage] = useState(null);
    const [newName, setNewName] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newBio, setNewBio] = useState("");

    const handleImageUpload = (e) => {
        const file = e.target.files;
        // const newImages = files.map((file) => URL.createObjectURL(file));
        setImage(file);
    };

    const handleCharCount = (e, maxLength) => `${e.target.value.length} / ${maxLength}`;


    return (
        <div className="edit-modal-container">

            <button className="cancel" onClick={backToProfile}>Cancel changes</button>

            <div className="change-profile-pic">
                <img className="profile-pic" src={`data:${imageType};base64,${imageData}`}></img>
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
                            maxLength={30}
                            placeholder={username}
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}    
                        />
                        <p className="count">{handleCharCount({ target: { value: username } }, 30)}</p>
                    </div>
                </div>
                <div className="attribute">
                    <label htmlFor="name">Name: </label>
                    <div className="column">
                        <input
                            id="name"
                            value={newName}
                            maxLength={30}
                            placeholder={name}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <p className="count">{handleCharCount({ target: { value: username } }, 30)}</p>
                    </div>
                </div>
                <div className="attribute bio">
                    <label htmlFor="bio">Bio: </label>
                    <div className="column">
                        <textarea
                            id="bio"
                            value={newBio}
                            maxLength={150}
                            placeholder={bio}
                            onChange={(e) => setNewBio(e.target.value)}
                        />
                        <p className="count">{handleCharCount({ target: { value: bio } }, 150)}</p>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

EditModal.PropTypes = {
    username: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    profilePicType: PropTypes.string.isRequired,
    profilePicData: PropTypes.string.isRequired,
    backToProfile: PropTypes.func.isRequired,
}

export default EditModal;