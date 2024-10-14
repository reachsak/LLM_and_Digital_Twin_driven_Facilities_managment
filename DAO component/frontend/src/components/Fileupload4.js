import React, { useState, useRef } from "react";

function Fileupload4({ setBase64Image }) {
  const [imageSrc, setImageSrc] = useState("");
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageSrc(reader.result);
      convertToBase64(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const convertToBase64 = (imageSrc) => {
    const base64String = imageSrc.split(",")[1];
    setBase64Image(base64String); // Pass base64 encoded image back to parent component
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <button onClick={() => fileInputRef.current.click()}>Upload Image</button>
      <br />
      {imageSrc && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={imageSrc} alt="Uploaded" width="200" />
        </div>
      )}
    </div>
  );
}

export default Fileupload4;
