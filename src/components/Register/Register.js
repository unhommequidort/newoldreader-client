import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function registerUser(event) {
    event.preventDefault();

    const response = await fetch("http://localhost:5000/api/register", {
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
