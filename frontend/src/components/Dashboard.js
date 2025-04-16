import React, { useEffect } from "react";

function Dashboard({ user, onLogout }) {
  useEffect(() => {
    window.Intercom("boot", {
      app_id: "your_app_id_here", // replace with real ID
      name: user.name,
      email: user.email,
    });

    return () => {
      window.Intercom("shutdown");
    };
  }, [user]);

  return (
    <div className="dashboard">
      <h2>Welcome, {user.name} 👋</h2>
      <p>Your email: {user.email}</p>
      <button onClick={onLogout}>Logout</button>

      <div className="support-box">
        <h3>Support Tickets (coming soon)</h3>
        <p>You don’t have any open tickets right now.</p>
      </div>
    </div>
  );
}

export default Dashboard;
