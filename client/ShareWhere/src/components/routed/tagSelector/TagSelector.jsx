import PropTypes from "prop-types";
import "./tagSelector.css";
import { useState, useEffect } from "react";

const TagSelector = ({ tags, selectedTags, setSelectedTags }) => {

    const [shrinkTags, setShrinkTags] = useState(false);

    const toggleTagSelection = (tagGroup, tagName) => {
        setSelectedTags((prev) => {
            const updatedTags = { ...prev };
    
            if (updatedTags[tagGroup] === tagName) {
                delete updatedTags[tagGroup];
            } else {
                updatedTags[tagGroup] = tagName;
            }
    
            return updatedTags;
        });
    };

    useEffect(() => {
        function handleResize() {
            setShrinkTags(window.innerWidth < 1400);
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {!shrinkTags ? (
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
            ) : (
                <div className="tags-container">
                    <p className="addloc-label">Add tags</p>
                    {Object.entries(tags)
                        .flatMap(([group, groupTags]) =>
                            groupTags.map((tag) => ({ ...tag, group }))
                        )
                        .map((tag) => (
                            <button
                                key={tag.tagId}
                                className={`tag-btn ${selectedTags[tag.group] === tag.tagName ? "selected" : ""}`}
                                onClick={() => toggleTagSelection(tag.group, tag.tagName)}
                            >
                                {tag.tagName}
                            </button>
                    ))}
                </div>
            )}
        </>
    );
};

TagSelector.propTypes = {
    tags: PropTypes.object.isRequired,
    selectedTags: PropTypes.object.isRequired,
    setSelectedTags: PropTypes.func.isRequired,
};

export default TagSelector;
