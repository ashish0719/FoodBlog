import React, { useState } from "react";
import axios from "axios";

export default function Forms({ setIsOpen, setToken, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignUp ? "signUp" : "login";

    const payload = { email, password };
    if (isSignUp) payload.username = username;

    try {
      const res = await axios.post(
        `http://localhost:8000/${endpoint}`,
        payload
      );
      const token = res.data.token;
      const user = res.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);

      setIsOpen();
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <form className="form" onSubmit={handleOnSubmit}>
      {isSignUp && (
        <div className="form-control">
          <label>Username</label>
          <input
            type="text"
            name="username"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
      )}
      <div className="form-control">
        <label>Email</label>
        <input
          type="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-control">
        <label>Password</label>
        <input
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
      <br />
      {error && <h6 className="error">{error}</h6>}
      <br />
      <p
        onClick={() => setIsSignUp((pre) => !pre)}
        style={{ cursor: "pointer" }}
      >
        {isSignUp ? "Already have an account" : "Create new account"}
      </p>
    </form>
  );
}
