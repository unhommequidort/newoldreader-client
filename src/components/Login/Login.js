import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

// Replace empty string with Azure url
const API_ROOT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://newoldreader-server.azurewebsites.net";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function logInUser(event) {
    event.preventDefault();

    const response = await fetch(`${API_ROOT}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (data.user) {
      localStorage.setItem("token", data.user);
      window.location.href = "/dashboard";
    } else {
      alert("Please check your username and password");
    }
  }

  return (
    <div>
      <h1>Log In</h1>
      <form onSubmit={logInUser} className="login-form">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          name="username"
          placeholder="Username"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          name="password"
          placeholder="Password"
        />
        <input type="submit" value="Log In" />
      </form>
      <div>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

export default Login;
