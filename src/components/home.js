import React, { useState } from "react";
import Modal from "react-modal";
import "./home.css";
import cloudImage from '../assets/images/cloud.png';

Modal.setAppElement("#root"); // Required for accessibility

function Home() {
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

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
    backgroundImage: `url(${cloudImage})`, // Use imported image here
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
  <h2>Sign Up</h2>
</div>

<div
  className="cloud cloud-right"
  onClick={() => setLoginModalOpen(true)}
  title="Login"
  style={{
    backgroundImage: `url(${cloudImage})`, // Use imported image here
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
  <h2>Login</h2>
</div>
      {/* Sign Up Modal */}
      <Modal
        isOpen={isSignupModalOpen}
        onRequestClose={() => setSignupModalOpen(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h3>Sign Up</h3>
        <form>
          <input type="text" placeholder="Username" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Sign Up</button>
        </form>
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
        <form>
          <input type="text" placeholder="Username" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <button onClick={() => setLoginModalOpen(false)}>Close</button>
      </Modal>
    </div>
  );
}

export default Home;
