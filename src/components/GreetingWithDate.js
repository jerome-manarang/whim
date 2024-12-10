import React, { useState, useEffect } from "react";
import "./GreetingWithDate.css";


export default function GreetingWithDate() {
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