import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useRef, useEffect, useState, react } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
  ref,
} from "firebase/storage";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
  setUserListingStart,
  setUserListingSuccess,
  setUserListingFailure
} from "../redux/user/userSlice";

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
  const navigate = useNavigate();


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
          body: JSON.stringify({
            ...formData,
            preferences: formData.preferences.length
              ? formData.preferences
              : currentUser.preferences,
          }),
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(updateUserFailure(data.message));
          return;
        }

        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
        resetForm();
      } catch (error) {}
    } else {
      alert("Password and Confirm Password should be same");
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/server/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/server/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  };

  const handleShowListings = async () => {
     dispatch(setUserListingStart());
    try {
      const res = await fetch(`/server/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(setUserListingFailure(data.message));
        return;
      }
       
      console.log(data);
      dispatch(setUserListingSuccess(data));
      navigate('/show-user-article');
    } catch (error) {
      dispatch(setUserListingFailure(error));
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

          <div className="flex flex-col space-y-4 p-4 border border-gray-300 rounded-md">
            <h2 className="text-xl font-semibold mb-4">Current Preferences</h2>
            <div className="flex flex-wrap space-x-2">
              {currentUser.preferences.map((preference, index) => (
                <span key={index} className="px-3 py-1 bg-gray-200 rounded-md">
                  {preference}
                </span>
              ))}
            </div>

            <div>
              <h2 className="text-xl font-semibold my-4">
                Select New Preferences
              </h2>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="sports"
                  checked={formData.preferences.includes("sports")}
                  onChange={() => handleCheckboxChange("sports")}
                  className="mr-2"
                />
                <span className="text-lg">Sports</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="space"
                  checked={formData.preferences.includes("space")}
                  onChange={() => handleCheckboxChange("space")}
                  className="mr-2"
                />
                <span className="text-lg">Space</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="coding"
                  checked={formData.preferences.includes("coding")}
                  onChange={() => handleCheckboxChange("coding")}
                  className="mr-2"
                />
                <span className="text-lg">Coding</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="politics"
                  checked={formData.preferences.includes("politics")}
                  onChange={() => handleCheckboxChange("politics")}
                  className="mr-2"
                />
                <span className="text-lg">Politics</span>
              </label>
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
          >
            {loading ? "Loading..." : "Update"}
          </button>

        </form>


        <div className="flex flex-col gap-3 mt-5">
            <Link
            className="bg-blue-400 hover:bg-blue-600 text-white py-2 rounded-lg text-center hover:opacity-95"
            to={"/create-listing"}
          >
            Create Article
          </Link>
          
          <button
            onClick={handleShowListings}
            className="bg-blue-400 hover:bg-blue-600 text-white py-2 rounded-lg text-center hover:opacity-95"
            to={"/show-user-article"}
          >
             Show Article
          </button>
        </div>
          
        <div className="flex justify-between mt-5">
          <span
            onClick={handleDeleteUser}
            className="text-red-700 cursor-pointer"
          >
            Delete account
          </span>
          <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
            Sign out
          </span>
        </div>
        <p className="text-red-700 mt-5">{error ? error : ""}</p>
        <p className="text-green-700 mt-5">
          {updateSuccess ? "User is updated successfully" : ""}
        </p>
      </div>
    </div>
  );
}
