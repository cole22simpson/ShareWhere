import { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdClose } from "react-icons/md";
import PropTypes from 'prop-types';
import "./comment.css";
import dayjs from "dayjs";
import updateLocale from 'dayjs/plugin/updateLocale';

const Comment = ({ setCommentImageOpen, comment }) => {
    const [isLiked, setIsLiked] = useState(comment.likedBy.includes(parseInt(localStorage.getItem("userId"))));
    const [numLikes, setNumLikes] = useState(comment.likes);
    const [imagesOpen, setImagesOpen] = useState(false);
    const createdAtDate = dayjs(comment.timeCreated);
    const timeAgo = createdAtDate.fromNow();
    const [selectedImage, setSelectedImage] = useState(null);

    const openImage = (imageUrl) => {
        setSelectedImage(imageUrl);
        setCommentImageOpen(true);
    };

    const closeImage = () => {
        setSelectedImage(null);
        setCommentImageOpen(false);
    };

    useEffect(() => {
        dayjs.extend(updateLocale);

        dayjs.updateLocale('en', {
            relativeTime: {
                future: "in %s",
                past: "%s",
                s: '%ds',
                m: "1m",
                mm: "%dm",
                h: "1h",
                hh: "%dh",
                d: "1d",
                dd: "%dd",
                M: "1mon",
                MM: "%dmon",
                y: "1y",
                yy: "%dy"
            }
        });
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.stopPropagation(); // Stop event from affecting post modal
                closeImage();
            }
        };

        if (selectedImage) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedImage]);

    const handleLike = async (event, action) => {
        event.preventDefault();
        const type = action;

        const userId = localStorage.getItem("userId");

        const formData = new FormData();

        formData.append("userId", userId);
        formData.append("commentId", comment.commentId);
        formData.append("field", type);

        try {
            const response = await fetch(`http://localhost:8080/comments/like`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setIsLiked(!isLiked);
                setNumLikes(data.length);
            }
            else {
                console.error("Like failed: ", await response.text());
            }
        } catch (error) {
            console.error("Error during like: ", error);
        }
    }

  return (
    <>
    <div className="location-comment">
        <img 
            className="commenter-prof-pic" 
            src={comment.commenterProfilePic.imageUrl} 
        />
        <div className="comment-middle">
            <div className="comment-top">
                <p className="commenter-username">{comment.commenterUser}</p>
                <p className="comment-time">{timeAgo}</p>
            </div>
            <p className="comment-text">{comment.commentText}</p>
            {comment.images.length > 0 && (
                <>
                    {!imagesOpen ? (
                        <p className="view-images" onClick={() => setImagesOpen(true)}>View images <MdKeyboardArrowDown/></p>
                    ) : (
                        <>
                            <div className="comment-images">
                                {comment.images.map((image) => (
                                    <img
                                        className="comment-image"
                                        key={image.imageId}
                                        src={image.imageUrl}
                                        onClick={() => openImage(image.imageUrl)}
                                    />
                                ))}
                            </div>
                            <p className="view-images" onClick={() => setImagesOpen(false)}>Collapse <MdKeyboardArrowUp/></p>
                        </>
                    )}
                </>
            )}
        </div>
        <div className="likes-container">
            {!isLiked ? (
                <button 
                    className="like-comment"
                    onClick={(e) => handleLike(e, "LIKE")}>
                    <FiHeart />
                </button>
            ) : (
                <button 
                    className="unlike-comment" 
                    onClick={(e) => handleLike(e, "UNLIKE")}>
                    <FaHeart />
                </button>
            )}
            <p className="comment-likes">{numLikes}</p>
        </div>
    </div>
    {selectedImage && (
        <div className="image-modal" onClick={closeImage}>
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                <p className="close-btn" onClick={closeImage}><MdClose /></p>
                <img src={selectedImage} />
            </div>
        </div>
    )}
    </>
  );
};

Comment.propTypes = {
    comment: PropTypes.shape({
        commenterProfilePic: PropTypes.shape({
            imageUrl: PropTypes.string.isRequired,
          }).isRequired,
        commenterUser: PropTypes.string.isRequired,
        commentText: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(PropTypes.object).isRequired, 
        likes: PropTypes.number.isRequired,
        likedBy: PropTypes.arrayOf(PropTypes.number).isRequired,
        commentId: PropTypes.number.isRequired,
        timeCreated: PropTypes.string.isRequired,
    }),
    setCommentImageOpen: PropTypes.func.isRequired,
  };

export default Comment;