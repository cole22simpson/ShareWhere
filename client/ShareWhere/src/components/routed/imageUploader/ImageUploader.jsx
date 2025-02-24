import PropTypes from "prop-types";
import "./imageUploader.css";
import { useState } from "react";
import imageCompression from "browser-image-compression"; // Import the compression library

const ImageUploader = ({ images, setImages }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageUpload = async (e) => {
    setImageError(false);
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      setImageError(true);
      return;
    }

    try {
      const compressedFiles = await Promise.all(
        files.map(async (file) => {
          const options = {
            maxSizeMB: 2, // Set max size in MB
            maxWidthOrHeight: 800, // Set max width or height for resizing
            useWebWorker: true,
          };
          return await imageCompression(file, options); // Compress the image
        })
      );
      setImages((prev) => [...prev, ...compressedFiles]);
    } catch (error) {
      console.error("Error compressing image:", error);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const getPreviewURL = (file) => {
    if (typeof file === "string") return file;
    return URL.createObjectURL(file);
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
      <label className="custom-upload-button" htmlFor="image-input">
        Upload Photos
      </label>
      <div className="image-preview-container">
        {images.map((file, index) => (
          <div key={index} className="image-wrapper">
            <img src={getPreviewURL(file)} alt={`Uploaded ${index}`} />
            <button className="remove-btn" onClick={() => removeImage(index)}>
              ✖
            </button>
          </div>
        ))}
      </div>
      <p className="photo-count">{images.length} / 5 photos uploaded</p>
      <div className="error-container">
        <p className={`error ${imageError ? "shown" : ""}`}>
          You can only upload up to 5 photos
        </p>
      </div>
    </div>
  );
};

ImageUploader.propTypes = {
  images: PropTypes.array.isRequired,
  setImages: PropTypes.func.isRequired,
};

export default ImageUploader;
