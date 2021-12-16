import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

// Replace empty string with Azure url
const API_ROOT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://newoldreader-server.azurewebsites.net";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function registerUser(event) {
    event.preventDefault();

    if (!username || !password) {
      return alert("Please provide a username and a password");
    }

    const response = await fetch(`${API_ROOT}/api/register`, {
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

    if (data.status === "ok") {
      navigate("/login");
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={registerUser} className="login-form">
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
        <input type="submit" value="Register" />
      </form>
    </div>
  );
}

export default Register;
