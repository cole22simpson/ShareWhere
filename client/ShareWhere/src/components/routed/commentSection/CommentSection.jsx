import "./commentSection.css";
import { useState } from "react";
import { BsArrowUpCircleFill } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";
import { MdAddAPhoto } from "react-icons/md";
import PropTypes from "prop-types";
import Comment from "../comment/Comment";

const CommentSection = ({ comments, locationId }) => {

    const [locationComments, setLocationComments] = useState(comments);
    const [commentText, setCommentText] = useState("");
    const [commentImages, setCommentImages] = useState([]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (commentImages.length + files.length > 5) {
            alert("You can only upload up to 5 photos.");
            return;
        }
        setCommentImages((prev) => [...prev, ...files]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();

        const userId = localStorage.getItem("userId");

        formData.append("userId", userId);
        formData.append("locationId", locationId);
        formData.append("commentText", commentText);
        commentImages.forEach(image => {
            formData.append("imageFiles", image);
    });

        try {
            const response = await fetch("http://localhost:8080/comments/send", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const newComment = await response.json();
            setLocationComments([...locationComments, newComment]);
            setCommentText("");
            setCommentImages([]);

        } catch (error) {
            console.error("Error submitting location:", error);
        }
    };

    return (
        <div className="comments-container">
            <p className="location-header">Comments</p>
            <hr/>
            {locationComments.length === 0 ? (
                <div className="no-comments">
                    <p>No comments yet</p>
                </div>
            ) : (
                <div className="comments">
                    {locationComments.map((comment) => (
                        <Comment key={comment.commentId} comment={comment} />
                    ))}
                </div>
            )}
            <div className="add-comment-container">
                <div className="comment-top-row">
                    <textarea
                        type="text"
                        className="comment-input"
                        placeholder="Write a comment"
                        maxLength="800"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <input
                        id="comment-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        multiple
                        hidden
                    />
                    <div className="upload-and-send">
                        <div className="upload-btn-container">
                            <label className="comment-image-button" htmlFor="comment-image-upload"><MdAddAPhoto /></label>
                            <p className="photo-count">{commentImages.length} / 5</p>
                        </div>
                        <div className="send-btn">
                            <button className="submit-comment" onClick={handleSubmit}><IoSendSharp/></button>
                        </div>
                    </div>
                </div>
                <div className="uploaded-images"> 
                    {commentImages.map((image, index) => (
                        <img 
                            key={index} 
                            src={URL.createObjectURL(image)} 
                            alt={`Uploaded Image ${index + 1}`} 
                            className="uploaded-image" 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

CommentSection.propTypes = {
    comments: PropTypes.arrayOf(PropTypes.object).isRequired,
    locationId: PropTypes.number.isRequired,
};

export default CommentSection;