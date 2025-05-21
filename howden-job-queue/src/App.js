import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import JobsPage from "./pages/JobsPage";

function App() {
  const [userId, setUserId] = useState(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            userId ? (
              <Navigate to="/jobs" />
            ) : (
              <LoginPage setUserId={setUserId} />
            )
          }
        />
        <Route
          path="/jobs"
          element={
            userId ? (
              <JobsPage userId={userId} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
