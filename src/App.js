import React, { useState, useEffect } from "react";
import Modal from "react-modal";

// Set the app element for accessibility
Modal.setAppElement("#root");

function GreetingWithDate() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const [quote, setQuote] = useState("");

  useEffect(() => {
    fetch("https://zenquotes.io/api/random")
      .then((response) => response.json())
      .then((data) => {
        setQuote(data[0].q);
      })
      .catch((error) => console.error("Error fetching quote:", error));
  }, []);

  return (
    <div className="container">
      <div className="greeting">
        <h1>Welcome back, <br />User!</h1>
      </div>
      <div className="date-box">
        <h2>The date is {currentDate}</h2>
        <div className="quote">
          <p>{quote ? `"${quote}"` : "Loading quote..."}</p>
        </div>
      </div>
    </div>
  );
}

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [taskInput, setTaskInput] = useState(""); // Task description
  const [importance, setImportance] = useState("green"); // Importance level

  const addTask = () => {
    if (taskInput.trim()) {
      setTasks([...tasks, { task: taskInput, importance }]);
      setTaskInput(""); // Reset input field
      setImportance("green"); // Reset importance level
      setShowModal(false); // Close modal
    } else {
      alert("Please enter a task description!");
    }
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="task-manager">
      <h2>Tasks</h2>

      <div className="task-input">
        <button onClick={() => setShowModal(true)}>
          + Add Task</button>
      </div>

      <ul className="task-list">
        {tasks.map((task, index) => (
          <li key={index} className="task-item">
            <div className="task-details">
              <span
                className={`importance-circle ${task.importance}`}
                title={`Importance: ${task.importance}`}
              ></span>
              <span>{task.task}</span>
            </div>
            <button onClick={() => removeTask(index)}>Remove</button>
          </li>
        ))}
      </ul>

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Add Task Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h3>Add New Task</h3>
        <label>
          Task:
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Enter task description"
          />
        </label>
        <label>
          Importance:
          <select
            value={importance}
            onChange={(e) => setImportance(e.target.value)}
          >
            <option value="green">Low (Green)</option>
            <option value="yellow">Medium (Yellow)</option>
            <option value="red">High (Red)</option>
          </select>
        </label>
        <div className="modal-actions">
          <button onClick={addTask}>Add Task</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}

function App() {
  return (
    <div>
      <GreetingWithDate />
      <TaskManager />
    </div>
  );
}

export default App;
