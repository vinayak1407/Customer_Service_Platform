import React from "react";

function Login() {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/requests/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-300">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full text-center space-y-6">
        <h1 className="text-3xl font-semibold text-indigo-800">Welcome Back!</h1>
        <p className="text-gray-600">Please sign in to access your requests.</p>
        
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 transition duration-300"
        >
          <i className="fab fa-google mr-2"></i> Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
