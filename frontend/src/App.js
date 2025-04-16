import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./components/Login";
import RequestForm from "./components/RequestForm";
import RequestList from "./components/RequestList";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);


  useEffect(() => {
    axios.defaults.baseURL = process.env.REACT_APP_API_URL;
    axios.defaults.withCredentials = true;


    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    // ✅ Save token from URL if present
    if (tokenFromUrl) {
      localStorage.setItem("authToken", tokenFromUrl);
      // Clean URL
      const cleanedUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanedUrl);
    }

    // ✅ Check for token in localStorage
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      axios
        .get("/auth/user", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
        .then((res) => setUser(res.data))
        .catch(() => {
          setUser(null);
          localStorage.removeItem("authToken"); // Clear invalid token
        });
    }
  }, []);

  return (
    <div className="app-container">
      <h1 className="app-title">Customer Service Platform</h1>
      {!user ? (
        <Login />
      ) : (
        <div className="dashboard">
          <RequestForm />
          <RequestList />
        </div>
      )}
    </div>
  );
}

export default App;
