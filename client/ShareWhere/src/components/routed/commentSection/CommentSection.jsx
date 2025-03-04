import "./commentSection.css";
import { useState, useEffect } from "react";
import { IoSendSharp } from "react-icons/io5";
import { MdAddAPhoto } from "react-icons/md";
import PropTypes from "prop-types";
import Comment from "../comment/Comment";
import useAuth from "../authContext/useAuth";
import imageCompression from 'browser-image-compression';
import UseAnimations from "react-useanimations";
import loading from 'react-useanimations/lib/loading';

const CommentSection = ({ setCommentImageOpen, comments, locationId }) => {

    const [locationComments, setLocationComments] = useState(comments);
    const [commentText, setCommentText] = useState("");
    const [commentImages, setCommentImages] = useState([]);
    const { userLoggedIn, setUserLoggedIn } = useAuth();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const handleCommentDeleted = (deletedCommentId) => {
        setLocationComments(prevComments => 
            prevComments.filter(comment => comment.commentId !== deletedCommentId)
        );
    };

    useEffect(() => {
        setDisabled(
            commentText === "" &&
            commentImages.length === 0
        );
    }, [commentText, commentImages]);

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);

        if (commentImages.length + files.length > 5) {
            alert("You can only upload up to 5 photos.");
            return;
        }

        try {
            const compressedFiles = await Promise.all(
                files.map(async (file) => {
                    const options = {
                        maxSizeMB: 2,
                        maxWidthOrHeight: 800,
                        useWebWorker: true,
                    };
                    const compressedFile = await imageCompression(file, options);
                    return compressedFile;
                })
            );

            setCommentImages((prev) => [...prev, ...compressedFiles]);
        } catch (error) {
            console.error("Error during image compression: ", error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setIsSubmitted(true);

        const formData = new FormData();

        const userId = localStorage.getItem("userId");

        formData.append("user_id", userId);
        formData.append("location_id", locationId);
        formData.append("comment_text", commentText);
        commentImages.forEach(image => {
            formData.append("image_files", image);
    });

        try {
            const response = await fetch("https://sharewheresocial.com/comments/send", {
                method: "POST",
                body: formData,
                credentials: "include",
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
        } finally {
            setIsSubmitted(false);
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
                        <Comment key={comment.commentId} handleCommentDeleted={handleCommentDeleted} setCommentImageOpen={setCommentImageOpen} comment={comment} />
                    ))}
                </div>
            )}

            {userLoggedIn && (
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
                                <button className="submit-comment" disabled={disabled} onClick={handleSubmit}>
                                    {!isSubmitted ? (
                                        <IoSendSharp/>
                                    ) : (
                                        <UseAnimations animation={loading} />
                                    )}
                                </button>
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
            )}
        </div>
    );
};

CommentSection.propTypes = {
    setCommentImageOpen: PropTypes.func.isRequired,
    comments: PropTypes.arrayOf(PropTypes.object).isRequired,
    locationId: PropTypes.number.isRequired,
};

export default CommentSection;