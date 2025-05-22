import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage({ setUserId }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await axios.post("http://localhost:8000/login", {
        email,
        password,
      });

      const { token, user_id } = response.data;

      // Store token in localStorage (simulated)
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", user_id);

      setUserId(user_id); // triggers redirect
      navigate("/jobs");
    } catch (err) {
      console.error(err);
      setErrorMsg("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-blue-600">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
