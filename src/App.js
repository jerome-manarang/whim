import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GreetingWithDate from "./components/GreetingWithDate";
import TaskManager from "./components/TaskManager";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <GreetingWithDate />
              <TaskManager />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;


{/*import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home"; // Import your Home component
import GreetingWithDate from "./components/GreetingWithDate";
import TaskManager from "./components/TaskManager";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  //const isAuthenticated = !!localStorage.getItem("token"); // Check if user is logged in
  const isAuthenticated = true;

  return (
    <Router>
      <Routes>
        {/* Home Route 
        <Route path="/" element={<Home />} />

        { Public Routes}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/tasks" /> : <Login />}
        />
        <Route path="/signup" element={<Signup />} />
  */}
        {/* Protected Routes}
        <Route
          path="/tasks"
          element={isAuthenticated ? (
            <>
              <GreetingWithDate />
              <TaskManager />
          </>
          ) : (
            <Navigate to="/login" />
          )}
        />
      </Routes>
    </Router>
  );
}

export default App;
*/}