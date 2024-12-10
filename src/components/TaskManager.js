import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

Modal.setAppElement("#root");

export default function TaskManager() {
    const [tasks, setTasks] = useState([]); // Task list 🗒️
    const [showModal, setShowModal] = useState(false); // Modal visibility 🏠
    const [taskInput, setTaskInput] = useState(""); // Task description ✏️
    const [importance, setImportance] = useState("green"); // Task priority 🟢🟡🔴
    const [taskDate, setTaskDate] = useState(new Date()); // Selected task date 📅
    const [selectedDate, setSelectedDate] = useState(new Date()); // Currently selected date in calendar 📅
  
    const addTask = () => {
      if (taskInput.trim()) {
        setTasks([
          ...tasks,
          { task: taskInput, importance, date: taskDate.toDateString() }, // Add task with date 🗓️
        ]);
        setTaskInput(""); // Reset input ✏️
        setImportance("green"); // Reset importance 🟢
        setTaskDate(new Date()); // Reset task date 📅
        setShowModal(false); // Close modal 🚪
      } else {
        alert("Please enter a task description!"); // Alert SpongeBob if it's empty! 🧽
      }
    };
  
    const tasksForSelectedDate = tasks.filter(
      (task) => task.date === selectedDate.toDateString()
    ); // Filter tasks for the selected date
  
    return (
  
  
      <div className="task-and-calendar">
  
        {/* Task Manager Section */}
        <div className="task-manager">
          <h2>Tasks for {selectedDate.toDateString()}</h2>
          <ul className="task-list">
            {tasksForSelectedDate.length > 0 ? (
              tasksForSelectedDate.map((task, index) => (
                <li key={index} className="task-item">
                  <div className="task-details">
                    <span
                      className={`importance-circle ${task.importance}`}
                      title={`Importance: ${task.importance}`}
                    ></span>
                    <span>{task.task}</span>
                  </div>
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
            onChange={setSelectedDate} // Update the selected date
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
              value={taskDate.toISOString().split("T")[0]} // Convert to YYYY-MM-DD for input
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