import PropTypes from "prop-types";
import "./tagSelector.css";

const TagSelector = ({ tags, selectedTags, setSelectedTags }) => {
    const toggleTagSelection = (tagGroup, tagName) => {
        setSelectedTags((prev) => ({
            ...prev,
            [tagGroup]: prev[tagGroup] === tagName ? null : tagName,
        }));
    };

    return (
        <div className="tags-container">
            <p className="addloc-label">Add tags</p>
            {Object.entries(tags).map(([group, groupTags]) => (
                <div key={group} className="tag-group">
                    {groupTags.map((tag) => (
                        <button
                            key={tag.tagId}
                            className={`tag-btn ${selectedTags[group] === tag.tagName ? "selected" : ""}`}
                            onClick={() => toggleTagSelection(group, tag.tagName)}
                        >
                            {tag.tagName}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};

TagSelector.propTypes = {
    tags: PropTypes.object.isRequired,
    selectedTags: PropTypes.object.isRequired,
    setSelectedTags: PropTypes.func.isRequired,
};

export default TagSelector;
