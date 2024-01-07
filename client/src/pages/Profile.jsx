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
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({
    userFirstName: "",
    userLastName: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    preferences: [],
  });

  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  console.log(currentUser.preferences);

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

  const handleCheckboxChange = (preference) => {
    setFormData((prevData) => {
      if (prevData.preferences.includes(preference)) {
        return {
          ...prevData,
          preferences: prevData.preferences.filter(
            (item) => item !== preference
          ),
        };
      } else {
        return {
          ...prevData,
          preferences: [...prevData.preferences, preference],
        };
      }
    });
  };

  const handleChange = (e) => {
    console.log(formData);
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      userFirstName: "",
      userLastName: "",
      phoneNumber: "",
      email: "",
      dateOfBirth: "",
      password: "",
      confirmPassword: "",
      preferences: [],
    });
    setFile(undefined);
    setFilePerc(0);
    setFileUploadError(false);
    setUpdateSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password === formData.confirmPassword) {
      try {
        dispatch(updateUserStart());
        const res = await fetch(`/server/user/update/${currentUser._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(updateUserFailure(data.message));
          return;
        }
        console.log(data);
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
        resetForm();
      } catch (error) {}
    } else {
      alert("Password and Confirm Password should be same");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            onChange={handleChange}
            className="border p-3 rounded-lg focus:outline-none focus:border-blue-500"
            type="text"
            name="userFirstName"
            placeholder="First Name"
            defaultValue={currentUser.userFirstName}
            required
          />

          <input
            onChange={handleChange}
            className="border p-3 rounded-lg focus:outline-none focus:border-blue-500"
            type="text"
            name="userLastName"
            placeholder="Last Name"
            defaultValue={currentUser.userLastName}
            required
          />

          <input
            onChange={handleChange}
            className="border p-3 rounded-lg focus:outline-none focus:border-blue-500"
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            defaultValue={currentUser.phoneNumber}
            required
          />

          <input
            onChange={handleChange}
            className="border p-3 rounded-lg focus:outline-none focus:border-blue-500"
            type="email"
            name="email"
            placeholder="Email"
            defaultValue={currentUser.email}
            required
          />

          <input
            onChange={handleChange}
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
            onChange={handleChange}
            className="border p-3 rounded-lg focus:outline-none focus:border-blue-500"
            type="password"
            name="password"
            placeholder="Password"
            defaultValue={currentUser.password}
          />

          <input
            onChange={handleChange}
            className="border p-3 rounded-lg focus:outline-none focus:border-blue-500"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            defaultValue={currentUser.confirmPassword}
          />

          <div className="space-y-2">
            <h6 className="text-lg font-semibold mb-2">
              Select New Preferences
            </h6>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="sports"
                checked={formData.preferences.includes("sports")}
                onChange={() => handleCheckboxChange("sports")}
              />
              <span className="ml-2">Sports</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="space"
                checked={formData.preferences.includes("space")}
                onChange={() => handleCheckboxChange("space")}
              />
              <span className="ml-2">Space</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="coding"
                checked={formData.preferences.includes("coding")}
                onChange={() => handleCheckboxChange("coding")}
              />
              <span className="ml-2">Coding</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="politics"
                checked={formData.preferences.includes("politics")}
                onChange={() => handleCheckboxChange("politics")}
              />
              <span className="ml-2">Politics</span>
            </label>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
          >
            {loading ? "Loading..." : "Update"}
          </button>
          <p>{error ? error : ""}</p>
          <p>{updateSuccess ? "User updated successfully!" : ""}</p>
        </form>
      </div>
    </div>
  );
}
