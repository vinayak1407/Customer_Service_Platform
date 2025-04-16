import React, { useState } from "react";
import axios from "axios";
import './RequestForm.css'; // Import the custom CSS file

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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments("");
      alert("✅ Request submitted!");
    } catch (error) {
      console.error("❌ Submit error:", error.response || error.message);
      alert("Error submitting request. Check console for details.");
    }
  };

  return (
    <div className="request-form-container">
      <div className="request-form-card">
        <h2 className="request-form-title">Submit a Request</h2>

        <div className="input-group">
          <label className="input-label">Category</label>
          <select
            className="input-field"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            <option>General Queries</option>
            <option>Product Features Queries</option>
            <option>Product Pricing Queries</option>
            <option>Product Feature Implementation Requests</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Comments</label>
          <textarea
            className="input-field textarea"
            placeholder="Describe your issue..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>

        <button onClick={submit} className="submit-btn">
          Submit
        </button>
      </div>
    </div>
  );
}

export default RequestForm;
