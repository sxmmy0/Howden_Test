import React, { useState } from "react";

export default function LoginPage({ setUserId }) {
  const [input, setInput] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setUserId(input.trim());
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
          type="text"
          placeholder="Enter your user ID"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
