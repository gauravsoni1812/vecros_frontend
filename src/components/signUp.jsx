/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
const SignupForm = () => {
   const [formData, setFormData] = useState({
    userName: "",
    password: "",
   });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Hook for navigation
  const authToken = Cookies.get("authToken");

  useEffect(() => {
    try {
      const decodedToken = jwtDecode(authToken);
      const userId = decodedToken?.userId;

      if (userId) {
        navigate("/");
      }
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("https://backend-vecros-1.onrender.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.msg);
        setFormData({ userName: "", password: "" }); // Reset form

        // Navigate to the SignIn page after successful signup
        navigate("/sign-in"); // Adjust the path if needed
      } else {
        const errorData = await response.json();
        setError(errorData.error || "An error occurred. Please try again.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold text-center mb-4">Signup</h1>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="userName" className="block text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
