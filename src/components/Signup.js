import React, { useState } from "react";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("Signup form submitted"); // Log when form is submitted

    try {
      const response = await fetch("http://localhost:5001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Fetch response status:", response.status); // Log fetch response status

      if (response.ok) {
        const data = await response.text();
        console.log("Server response data:", data);
        setMessage("Signup successful! You can now log in.");
      } else {
        const errorMessage = await response.text();
        console.error("Error message from server:", errorMessage);
        setMessage(`Signup failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error during signup request:", error);
      setMessage("An error occurred during signup.");
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign Up</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default Signup;
