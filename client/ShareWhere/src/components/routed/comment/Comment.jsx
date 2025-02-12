import { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from "react-icons/fa";
import PropTypes from 'prop-types';
import "./comment.css";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

const Comment = ({ comment }) => {
    const [isLiked, setIsLiked] = useState(false);
    const createdAtDate = dayjs(comment.timeCreated);
    const timeAgo = createdAtDate.fromNow();

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Here you would typically send a request to your server 
    // to update the like count for this specific comment 
    // on the backend.
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

  return (
    <div className="location-comment">
        <img 
            className="commenter-prof-pic" 
            src={`data:${comment.commenterProfilePic.imageType};base64,${comment.commenterProfilePic.imageData}`} 
        />
        <div className="comment-middle">
        <div className="comment-top">
            <p className="commenter-username">{comment.commenterUser}</p>
            <p className="comment-time">{timeAgo}</p>
        </div>
            <p className="comment-text">{comment.commentText}</p>
        </div>
        <div className="likes-container">
            <button 
                className={`like-comment ${isLiked ? 'liked' : ''}`} 
                onClick={handleLike}
            >
                {isLiked ? (
                    <FaHeart />
                ) : (
                    <FiHeart />
                )}
            </button>
            <p className="comment-likes">{comment.likes}</p>
        </div>
    </div>
  );
};

Comment.propTypes = {
    comment: PropTypes.shape({
        commenterProfilePic: PropTypes.shape({
            imageType: PropTypes.string.isRequired,
            imageData: PropTypes.string.isRequired,
          }).isRequired,
        commenterUser: PropTypes.string.isRequired,
        commentText: PropTypes.string.isRequired,
        likes: PropTypes.number.isRequired, 
        commentId: PropTypes.number.isRequired,
        timeCreated: PropTypes.string.isRequired,
    })
  };

export default Comment;