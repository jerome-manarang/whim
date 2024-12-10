import React, { useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import "./home.css";
import cloudImage from "../assets/images/cloud.png";

Modal.setAppElement("#root"); // Required for accessibility

function Home() {
  const navigate = useNavigate();

  // Modal state
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  // Signup state
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupMessage, setSignupMessage] = useState("");

  // Login state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("Signup form submitted");

    try {
      const response = await fetch("http://localhost:5001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: signupUsername,
          password: signupPassword,
        }),
      });

      if (response.ok) {
        const data = await response.text();
        console.log("Server response:", data);
        setSignupMessage("Signup successful! You can now log in.");
        setSignupModalOpen(false); // Close modal on success
      } else {
        const errorMessage = await response.text();
        console.error("Signup failed:", errorMessage);
        setSignupMessage(`Signup failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setSignupMessage("An error occurred during signup.");
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login form submitted");

    try {
      const response = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json(); // Assuming the server sends a JWT token
        console.log("Login successful, token:", data.token);
        localStorage.setItem("token", data.token); // Save the token for session management
        setLoginMessage("Login successful!");
        setLoginModalOpen(false); // Close modal on success
        navigate("/tasks"); // Redirect to /tasks
      } else {
        const errorMessage = await response.text();
        console.error("Login failed:", errorMessage);
        setLoginMessage(`Login failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setLoginMessage("An error occurred during login.");
    }
  };

  return (
    <div className="home">
      <div className="animated-title">
        <h1>Whim.com</h1>
        <h2>A Student Task Organizer</h2>
      </div>

      {/* Bottom-left Cloud for Sign Up */}
      <div
        className="cloud cloud-left"
        onClick={() => setSignupModalOpen(true)}
        title="Sign Up"
        style={{
          backgroundImage: `url(${cloudImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h2>Sign Up</h2>
      </div>

      {/* Bottom-right Cloud for Login */}
      <div
        className="cloud cloud-right"
        onClick={() => setLoginModalOpen(true)}
        title="Login"
        style={{
          backgroundImage: `url(${cloudImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h2>Login</h2>
      </div>

      {/* Signup Modal */}
      <Modal
        isOpen={isSignupModalOpen}
        onRequestClose={() => setSignupModalOpen(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h3>Sign Up</h3>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            value={signupUsername}
            onChange={(e) => setSignupUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        {signupMessage && <p>{signupMessage}</p>}
        <button onClick={() => setSignupModalOpen(false)}>Close</button>
      </Modal>

      {/* Login Modal */}
      <Modal
        isOpen={isLoginModalOpen}
        onRequestClose={() => setLoginModalOpen(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h3>Login</h3>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {loginMessage && <p>{loginMessage}</p>}
        <button onClick={() => setLoginModalOpen(false)}>Close</button>
      </Modal>
    </div>
  );
}

export default Home;
