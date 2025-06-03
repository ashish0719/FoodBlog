import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;
    const formData = new FormData();
    formData.append("profileImage", selectedFile);

    try {
      const res = await axios.post(
        `http://localhost:8000/Profile/${user._id}/upload-profile`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log(res.data.message); // Logs: "Profile image updated"

      const updatedUser = { ...user, profilePic: res.data.user.profileImage };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      alert("Failed to upload profile picture.");
    }
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">
      {/* Left side
      <div className="profile-left">
        <div className="profile-image-container">
          <img
            src={
              previewUrl || `/profilepics/${user.profileImage || "default.jpg"}`
            }
            alt="Profile"
            className="profile-image"
          />
          <input
            type="file"
            id="upload-profile"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <label htmlFor="upload-profile" className="upload-plus">
            +
          </label>
          {selectedFile && (
            <button onClick={handleUpload} className="upload-button">
              Upload
            </button>
          )}
        </div>
        <div className="profile-info">
          <h2>UserName</h2>
          <p>{user.username}</p>
          <h3>Email</h3>
          <p>{user.email}</p>
        </div>
      </div>

      {/* Right side */}
      {/* <div className="profile-right">
        <h3>Bio</h3>
        <p>
          {user.bio || "Updation is in progress wait till the latest versions "}
        </p>
      </div> } */}
      <h1>Work In Progress..............</h1>
    </div>
  );
}
