import React from "react";

function Login() {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/requests/auth/google`;
  };

  return (
    <div className="login-container">
      <button onClick={handleGoogleLogin} className="login-btn">
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;
