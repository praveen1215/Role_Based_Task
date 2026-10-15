
import { useState } from "react";
import { loginUser } from "../services/authService";
import { Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await loginUser(form);
      // We will add token handling and navigation
      // when implementing the backend login feature.
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      <form className="register-card" onSubmit={handleSubmit}>
        <h1>Welcome Back</h1>
        <p>Login to your Task Manager account</p>

        <label htmlFor="login-email">Email Address</label>
        <input
          id="login-email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
