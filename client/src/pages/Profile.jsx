import React from "react";
import { useSelector } from "react-redux";
import { useRef, useEffect, useState } from "react";
import {
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
  ref,
} from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  console.log(currentUser.avatar);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-6 text-center">Sign Up</h1>
        <form className="flex flex-col gap-4">
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt="profile"
            className="rounded-full h-20 w-20 object-cover cursor-pointer self-center mt-2"
          />

          <input
            className="border p-3 rounded-lg focus:outline-none focus:border-blue-500"
            type="text"
            name="userFirstName"
            placeholder="First Name"
            defaultValue={currentUser.userFirstName}
            required
          />

          <input
            className="border p-3 rounded-lg focus:outline-none focus:border-blue-500"
            type="text"
            name="userLastName"
            placeholder="Last Name"
            defaultValue={currentUser.userLastName}
            required
          />

          <input
            className="border p-3 rounded-lg focus:outline-none focus:border-blue-500"
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            defaultValue={currentUser.phoneNumber}
            required
          />

          <input
            className="border p-3 rounded-lg focus:outline-none focus:border-blue-500"
            type="email"
            name="email"
            placeholder="Email"
            defaultValue={currentUser.email}
            required
          />

          <input
            className="border p-3 rounded-lg focus:outline-none focus:border-blue-500"
            type="date"
            name="dateOfBirth"
            placeholder="Date of Birth"
            defaultValue={
              currentUser.dateOfBirth
                ? currentUser.dateOfBirth.split("T")[0]
                : ""
            }
            required
          />

          <input
            className="border p-3 rounded-lg focus:outline-none focus:border-blue-500"
            type="password"
            name="password"
            placeholder="Password"
            defaultValue={currentUser.password}
          />

          <input
            className="border p-3 rounded-lg focus:outline-none focus:border-blue-500"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            defaultValue={currentUser.confirmPassword}
          />

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}
