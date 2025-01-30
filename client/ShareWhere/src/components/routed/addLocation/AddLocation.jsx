// import "./addLocation.css";
// import { useState, useEffect, useRef } from "react";
// import {
//     APIProvider,
//     Map,
//     AdvancedMarker,
//     useAdvancedMarkerRef,
//     // MapCameraChangedEvent,
//     Pin,
//     // InfoWindow
// } from "@vis.gl/react-google-maps";
// import { getLocation } from "../../../assets/helpers/getLocation";
// // import { useUser } from "../userContext/useUser";

// function AddLocation () {
//     const positionRef = useRef({ lat: 0.0, lng: 0.0 });
//     const [markerRef, marker] = useAdvancedMarkerRef();
//     const [latitude, setLatitude] = useState(positionRef.current.lat);
//     const [longitude, setLongitude] = useState(positionRef.current.lng);
//     const [currCenter, setCurrCenter] = useState({ lat: positionRef.current.lat, lng: positionRef.current.lng});
//     const [isLoading, setIsLoading] = useState(true);
//     const [selectedPlace, setSelectedPlace] = useState(null);
//     const [images, setImages] = useState([]);
//     const [tags, setTags] = useState([]);
//     const [selectedTags, setSelectedTags] = useState([]);

//     function updateCharCount(inputId, counterId, maxLength) {
//         const inputEl = document.getElementById(inputId);
//         const charCountEl = document.getElementById(counterId);
//         charCountEl.textContent = `${inputEl.value.length} / ${maxLength}`;
//     };

//     const handleImageUpload = (event) => {
//         const files = Array.from(event.target.files);

//         if (images.length + files.length > 10) {
//             alert("You can only upload up to 10 photos.");
//             return;
//         }

//         const newImages = files.map((file) => URL.createObjectURL(file));
//         setImages((prevImages) => [...prevImages, ...newImages]);
//     };

//     const removeImage = (index) => {
//         setImages(images.filter((_, i) => i !== index));
//     };

//     const countImages = (images) => {
//         return images.length;
//     };


//     const handleLocationPermission = async () => {
//             try {
//                 const coords = await getLocation();
//                 positionRef.current = coords;
//                 setLatitude(coords.lat);
//                 setLongitude(coords.lng);
//                 localStorage.setItem("userCoordinates", JSON.stringify(coords));
//             } catch (error) {
//                 console.error(error);
//             }
//         };

//     useEffect(() => {
//         setIsLoading(true);
//         const storedCoords = localStorage.getItem("userCoordinates");
//         if (storedCoords) {
//             const coords = JSON.parse(storedCoords);
//             positionRef.current = coords;
//             setLatitude(coords.lat);
//             setLongitude(coords.lng);
//             setCurrCenter({ lat: coords.lat, lng: coords.lng });
//         } else {
//             handleLocationPermission();
//         }
//         setIsLoading(false);
//     }, [latitude, longitude]);

//     // useEffect(() => {
//     //     const fetchTags = async () => {
//     //         try {
//     //             const token = localStorage.getItem("jwtToken");
//     //             const response = await fetch("http://localhost:8080/tags", {
//     //                 method: "GET",
//     //                 headers: {
//     //                     Authorization: `Bearer ${token}`,
//     //                 },
//     //             });
//     //             if (!response.ok) {
//     //                 throw new Error("Failed to fetch tags");
//     //             }
//     //             const data = await response.json();
//     //             setTags(data);
//     //         } catch (error) {
//     //             console.error("Error fetching tags: ", error);
//     //         }
//     //     };
//     //     fetchTags();
//     // }, []);

//     // const toggleTagSelection = (tag) => {
//     //     console.log(selectedTags);
//     //     setSelectedTags((prevSelectedTags) => {
//     //         if (prevSelectedTags.includes(tag)) {
//     //             return prevSelectedTags.filter((t) => t !== tag);
//     //         } else {
//     //             return [...prevSelectedTags, tag];
//     //         }
//     //     });
//     // };

//     useEffect(() => {
//         const fetchTags = async () => {
//             try {
//                 const token = localStorage.getItem("jwtToken");
//                 const response = await fetch("http://localhost:8080/tags", {
//                     method: "GET",
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 if (!response.ok) {
//                     throw new Error("Failed to fetch tags");
//                 }
//                 const data = await response.json();
//                 const grouped = data.reduce((acc, tag) => {
//                     if (!acc[tag.tagGroup]) {
//                         acc[tag.tagGroup] = [];
//                     }
//                     acc[tag.tagGroup].push(tag);
//                     return acc;
//                 }, {});

//                 setTags(grouped);
//             } catch (error) {
//                 console.error("Error fetching tags: ", error);
//             }
//         };
//         fetchTags();
//     }, []);

//     const toggleTagSelection = (tagGroup, tag) => {
//         setSelectedTags((prevSelectedTags) => ({
//             ...prevSelectedTags,
//             [tagGroup]: prevSelectedTags[tagGroup] === tag ? null : tag,
//         }));
//     };


//     return (
//         <>
//             {isLoading ? (
//                 <div>Loading...</div>
//             ) : (
//                 <APIProvider
//                     apiKey="AIzaSyA3qoBRglmsQ2nyxvGWJ8SCI0az2PCL-bE"
//                     solutionChannel="GMP_devsite_samples_v3_rgmautocomplete">
//                     <div className="addloc-container">
//                         <div className="addloc-sidebar">
//                             <label htmlFor="input1" className="addloc-label">Name your location</label>
//                             <input
//                                 type="text"
//                                 placeholder="Come up with something fun"
//                                 id="input1"
//                                 className="addloc-input"
//                                 maxLength="80"
//                                 onInput={(e) => updateCharCount("input1", "charCount1", 80)}
//                             />
//                             <p className="char-count" id="charCount1">0 / 80</p>

//                             <label htmlFor="input2" className="addloc-label">Include some details about this location</label>
//                             <textarea
//                                 type="text"
//                                 placeholder="You can include information like directions or tips"
//                                 id="input2"
//                                 className="addloc-input big-input"
//                                 maxLength="1200"
//                                 onInput={(e) => updateCharCount("input2", "charCount2", 1200)}
//                             />
//                             <p className="char-count" id="charCount2">0 / 1200</p>
//                             <div className="tags-container">
//                                 <p className="addloc-label">Add tags:</p>
//                                     <div className="tags-only">
//                                         {Object.entries(tags).map(([tagGroup, groupTags]) => (
//                                             <div key={tagGroup} className="tag-group">
//                                                 <div className="tags">
//                                                     {groupTags.map((tag) => {
//                                                         return (
//                                                             <button
//                                                                 key={tag.tagId}
//                                                                 className={`tag-btn ${selectedTags[tagGroup] === tag.tagName ? "selected" : ""}`}
//                                                                 onClick={() => toggleTagSelection(tagGroup, tag.tagName)}
//                                                             >
//                                                                 {tag.tagName}
//                                                             </button>
//                                                         );
//                                                     })}
//                                                     </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                             </div>

//                             <div className="upload-container">
//                                 <input
//                                     type="file"
//                                     id="fileInput"
//                                     multiple
//                                     accept="image/*"
//                                     onChange={handleImageUpload}
//                                     hidden
//                                 />
//                                 <label htmlFor="fileInput" className="custom-upload-button">
//                                     Upload Photos
//                                 </label>

//                                 <div className="image-preview-container">
//                                     {images.map((src, index) => (
//                                     <div key={index} className="image-wrapper">
//                                         <img src={src} alt={`Uploaded ${index}`} />
//                                         <button className="remove-btn" onClick={() => removeImage(index)}>
//                                         ✖
//                                         </button>
//                                     </div>
//                                     ))}
//                                 </div>
//                                 <p className="photo-count">{countImages(images)} / 10 photos uploaded</p>
//                             </div>

                            
//                         </div>
//                         <div className="addloc-map-container">
                    
//                             <Map
//                                 defaultZoom={15}
//                                 defaultCenter={{ lat: latitude, lng: longitude }}
//                                 gestureHandling={"greedy"}
//                                 disableDefaultUI={true}
//                                 mapTypeId={"terrain"}
//                                 mapId={"8556750882f0b69f"}
//                                 // onCameraChanged={handlePlaceChanged}
//                                 >
//                                 <AdvancedMarker
//                                     ref={markerRef}
//                                     position={{ lat: latitude, lng: longitude }}>
//                                     <Pin
//                                         background={"red"}
//                                         borderColor={"black"}
//                                         glyphColor={"red"}
//                                     />
//                                 </AdvancedMarker>
//                             </Map>
//                         </div>
//                     </div>
//                 </APIProvider>
//             )}
//         </>
//     );
// };

// export default AddLocation;

import "./addLocation.css";
import { useState, useEffect, useRef } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { getLocation } from "../../../assets/helpers/getLocation";
import LocationForm from "../locationForm/LocationForm.jsx";

function AddLocation() {
    const positionRef = useRef({ lat: 0.0, lng: 0.0 });
    const [latitude, setLatitude] = useState(positionRef.current.lat);
    const [longitude, setLongitude] = useState(positionRef.current.lng);
    const [isLoading, setIsLoading] = useState(true);
    const [tags, setTags] = useState({});
    const [selectedTags, setSelectedTags] = useState({});
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const coords = await getLocation();
                positionRef.current = coords;
                setLatitude(coords.lat);
                setLongitude(coords.lng);
                localStorage.setItem("userCoordinates", JSON.stringify(coords));
            } catch (error) {
                console.error(error);
            }
            setIsLoading(false);
        };

        const storedCoords = localStorage.getItem("userCoordinates");
        if (storedCoords) {
            const coords = JSON.parse(storedCoords);
            setLatitude(coords.lat);
            setLongitude(coords.lng);
            setIsLoading(false);
        } else {
            fetchLocation();
        }
    }, []);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                const response = await fetch("http://localhost:8080/tags", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error("Failed to fetch tags");

                const data = await response.json();
                const groupedTags = data.reduce((acc, tag) => {
                    if (!acc[tag.tagGroup]) acc[tag.tagGroup] = [];
                    acc[tag.tagGroup].push(tag);
                    return acc;
                }, {});

                setTags(groupedTags);
            } catch (error) {
                console.error("Error fetching tags: ", error);
            }
        };

        fetchTags();
    }, []);

    return (
        <APIProvider apiKey="AIzaSyA3qoBRglmsQ2nyxvGWJ8SCI0az2PCL-bE">
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <LocationForm
                    latitude={latitude}
                    longitude={longitude}
                    tags={tags}
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                    images={images}
                    setImages={setImages}
                />
            )}
        </APIProvider>
    );
}

export default AddLocation;
