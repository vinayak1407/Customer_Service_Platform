import React, { useState, useEffect } from "react";
import axios from "axios";

function RequestList() {
  const [category, setCategory] = useState("General Queries");
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/requests?category=${category}`)
      .then(res => setRequests(res.data));
  }, [category]);

  return (
    <div>
      <h2>Requests for {category}</h2>
      <select onChange={(e) => setCategory(e.target.value)} value={category}>
        <option>General Queries</option>
        <option>Product Features Queries</option>
        <option>Product Pricing Queries</option>
        <option>Product Feature Implementation Requests</option>
      </select>
      <ul>
        {requests.map((r, idx) => (
          <li key={idx}>{r.comments}</li>
        ))}
      </ul>
    </div>
  );
}

export default RequestList;
