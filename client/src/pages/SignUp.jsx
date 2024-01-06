import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signUpStart,
  signUpSuccess,
  signUpFailure,
} from "../redux/user/userSlice";

const SignUp = () => {
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

  const { error, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    if( formData.password === formData.confirmPassword ){

      try {
        dispatch(signUpStart());
        const response = await fetch("/server/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        
        const data = await response.json();
        
        if (data.success === false) {
          dispatch(signUpFailure(data.message));
          return;
        }
        
        dispatch(signUpSuccess(data));
        navigate("/sign-in");
      } catch (error) {
        dispatch(signUpFailure(Data.message));
      }
    } else {
      // dispatch(signUpFailure(Data.message));
      alert("Password and Confirm Password is not same");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="border p-3 rounded-lg focus:outline-none focus:border-blue-500"
            type="text"
            name="userFirstName"
            placeholder="First Name"
            value={formData.userFirstName}
            onChange={handleChange}
            required
          />

          <input
            className="border p-3 rounded-lg focus:outline-none focus:border-blue-500"
            type="text"
            name="userLastName"
            placeholder="Last Name"
            value={formData.userLastName}
            onChange={handleChange}
            required
          />

          <input
            className="border p-3 rounded-lg focus:outline-none focus:border-blue-500"
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />

          <input
            className="border p-3 rounded-lg focus:outline-none focus:border-blue-500"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            className="border p-3 rounded-lg focus:outline-none focus:border-blue-500"
            type="date"
            name="dateOfBirth"
            placeholder="Date of Birth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />

          <input
            className="border p-3 rounded-lg focus:outline-none focus:border-blue-500"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            className="border p-3 rounded-lg focus:outline-none focus:border-blue-500"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <div className="space-y-2">
            <h5 className="text-lg font-semibold mb-2">Select Preferences</h5>

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
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
          >
            Sign Up
          </button>

          <div className="flex gap-2 mt-5">
            <p>Have an account?</p>
            <Link to={"/sign-in"}>
              <span className="text-blue-700">Sign in</span>
            </Link>
          </div>
          {error && <p className="text-red-500 mt-5">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignUp;
