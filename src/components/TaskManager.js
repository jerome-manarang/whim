import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

Modal.setAppElement("#root");

export default function TaskManager() {
  const [tasks, setTasks] = useState([]); // Task list
  const [taskInput, setTaskInput] = useState(""); // Task description
  const [importance, setImportance] = useState("green"); // Task importance
  const [taskDate, setTaskDate] = useState(new Date()); // Task date selected in the modal
  const [selectedDate, setSelectedDate] = useState(new Date()); // Currently selected date in the calendar
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [token, setToken] = useState(localStorage.getItem("token") || ""); // User token

  // Fetch tasks from backend on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:5001/tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token, // Include token in headers
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error("Error fetching tasks:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (token) {
      fetchTasks(); // Only fetch tasks if token is available
    }
  }, [token]);

  // Add a new task
  const addTask = async () => {
    if (!taskInput.trim()) {
      alert("Please enter a task description!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token, // Include token in headers
        },
        body: JSON.stringify({
          task: taskInput,
          importance,
          date: taskDate.toISOString().split("T")[0], // Format to YYYY-MM-DD
        }),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks((prevTasks) => [...prevTasks, newTask]); // Update local task list
        setTaskInput(""); // Clear task input
        setImportance("green"); // Reset importance
        setTaskDate(new Date()); // Reset task date
        setShowModal(false); // Close modal
      } else {
        console.error("Error adding task:", await response.text());
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Delete a task (frontend-only)
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Update "done" status of a task (frontend-only)
  const toggleTaskDone = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  // Filter tasks for the currently selected date in the calendar
  const tasksForSelectedDate = tasks.filter(
    (task) => task.date === selectedDate.toISOString().split("T")[0]
  );

  return (
    <div className="task-and-calendar">
      {/* Task List Section */}
      <div className="task-manager">
        <h2>Tasks for {selectedDate.toDateString()}</h2>
        <ul className="task-list">
          {tasksForSelectedDate.length > 0 ? (
            tasksForSelectedDate.map((task) => (
              <li key={task.id} className={`task-item ${task.done ? "done" : ""}`}>
                <div className="task-details">
                  <span
                    className={`importance-circle ${task.importance}`}
                    title={`Importance: ${task.importance}`}
                  ></span>
                  <span
                    style={{ textDecoration: task.done ? "line-through" : "none" }} // Toggle line-through for done tasks
                  >
                    {task.task}
                  </span>
                </div>
                <button onClick={() => toggleTaskDone(task.id)}>
                  {task.done ? "Undo" : "Done"}
                </button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </li>
            ))
          ) : (
            <li>No tasks for this date!</li>
          )}
        </ul>
        <button onClick={() => setShowModal(true)}>+ Add Task</button>
      </div>

      {/* Calendar Section */}
      <div className="calendar-container">
        <Calendar
          value={selectedDate}
          onChange={setSelectedDate} // Update selected date
        />
      </div>

      {/* Add Task Modal */}
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
          Task Date:
          <input
            type="date"
            value={taskDate.toISOString().split("T")[0]} // Format to YYYY-MM-DD
            onChange={(e) => setTaskDate(new Date(e.target.value))}
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