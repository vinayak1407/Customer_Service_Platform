import React, { useState } from "react";
import axios from "axios";

function RequestForm() {
  const [category, setCategory] = useState("General Queries");
  const [comments, setComments] = useState("");

  const submit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("No auth token found. Please log in again.");
        return;
      }
  
      await axios.post(
        "http://localhost:5000/requests",
        { category, comments },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔐 Send the token
          },
        }
      );
  
      setComments("");
      alert("Request submitted!");
    } catch (error) {
      console.error("❌ Submit error:", error.response || error.message);
      alert("Error submitting request. Check console for details.");
    }
  };
  

  return (
    <div>
      <h2>Submit Request</h2>
      <select onChange={(e) => setCategory(e.target.value)} value={category}>
        <option>General Queries</option>
        <option>Product Features Queries</option>
        <option>Product Pricing Queries</option>
        <option>Product Feature Implementation Requests</option>
      </select>
      <br />
      <textarea placeholder="Describe your issue..." value={comments}
        onChange={(e) => setComments(e.target.value)} />
      <br />
      <button onClick={submit}>Submit</button>
    </div>
  );
}

export default RequestForm;
