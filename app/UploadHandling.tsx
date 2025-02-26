"use client";
import { useState } from "react";



const MyComponent = () => {
  const [imageArray, setImageArray] = useState<string[]>([]); // ✅ Define state

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );

    setImageArray(fileArray); // ✅ Update state with new images
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      imageArray.forEach((image) => {
        formData.append("imageFiles", image); // Add each image to formData
      });
      const response = await fetch("../api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      <label>Images</label>
      <input 
        name="imageFiles" 
        type="file" 
        multiple // ✅ Allow multiple file selection
        onChange={handleFileUpload} 
      />

      {/* 🔥 Preview the selected images */}
      <div className="flex gap-2 mt-4">
        {imageArray.map((src, index) => (
          <img key={index} src={src} alt={`preview-${index}`} className="w-32 h-32 object-cover" />
        ))}
      </div>
    </div>
  );
};

export default MyComponent;// ✅ Export the component
