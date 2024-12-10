CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,                 -- Unique ID for each task
    user_id INTEGER NOT NULL,              -- Foreign key linking to the user
    task TEXT NOT NULL,                    -- Description of the task
    importance TEXT NOT NULL,              -- Importance level (green, yellow, red)
    date TEXT NOT NULL,                    -- Date of the task
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for task creation
    FOREIGN KEY (user_id) REFERENCES users (id) -- Foreign key constraint
);