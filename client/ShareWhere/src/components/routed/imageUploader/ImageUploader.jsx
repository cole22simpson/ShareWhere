import PropTypes from "prop-types";
import "./imageUploader.css";

const ImageUploader = ({ images, setImages }) => {
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 10) {
            alert("You can only upload up to 10 photos.");
            return;
        }
        const newImages = files.map((file) => URL.createObjectURL(file));
        setImages((prev) => [...prev, ...newImages]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <div className="upload-container">
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                hidden
                id="image-input"
                />
            <label className="custom-upload-button" htmlFor="image-input">Upload Photos</label>
            <div className="image-preview-container">
                {images.map((src, index) => (
                    <div key={index} className="image-wrapper">
                        <img src={src} alt={`Uploaded ${index}`} />
                        <button className="remove-btn" onClick={() => removeImage(index)}>✖</button>
                    </div>
                ))}
            </div>
            <p className="photo-count">{images.length} / 10 photos uploaded</p>
        </div>
    );
};

ImageUploader.propTypes = {
    images: PropTypes.array.isRequired,
    setImages: PropTypes.func.isRequired,
};

export default ImageUploader;
