import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home"; // Import your Home component
import GreetingWithDate from "./components/GreetingWithDate";
import TaskManager from "./components/TaskManager";

function App() {
  // Check if the user is authenticated (i.e., token exists in localStorage)
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Home />} />

        {/* Protected Route for Tasks */}
        <Route
          path="/tasks"
          element={
            isAuthenticated ? (
              <>
                <GreetingWithDate />
                <TaskManager />
              </>
            ) : (
              <Navigate to="/" /> // Redirect to Home if not authenticated
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
