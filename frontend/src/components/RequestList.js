import React, { useState, useEffect } from "react";
import axios from "axios";
import './RequestList.css'; // Import the custom CSS file

function RequestList() {
  const [category, setCategory] = useState("General Queries");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/requests?category=${category}`);
        setRequests(res.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [category]);

  return (
    <div className="request-list-container">
      <div className="request-list-card">
        <h2 className="request-list-title">Requests for {category}</h2>

        <div className="category-select-container">
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="category-select"
          >
            <option>General Queries</option>
            <option>Product Features Queries</option>
            <option>Product Pricing Queries</option>
            <option>Product Feature Implementation Requests</option>
          </select>
        </div>

        {loading ? (
          <p className="loading-text">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="no-requests-text">No requests found for this category.</p>
        ) : (
          <ul className="request-list">
            {requests.map((r, idx) => (
              <li key={idx} className="request-item">
                <p>{r.comments}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default RequestList;
