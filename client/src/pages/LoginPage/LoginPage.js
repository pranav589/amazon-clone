import React, { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function LoginPage() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/user/login", { ...user });
      localStorage.setItem("firstLogin", true);

      window.location.href = "/";
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  };

  const loginGuestSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/user/login", {
        email: "user@gmail.com",
        password: "password",
      });
      localStorage.setItem("firstLogin", true);

      window.location.href = "/";
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  };
  const loginGuestAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/user/login", {
        email: "admin@gmail.com",
        password: "adminPassword",
      });
      localStorage.setItem("firstLogin", true);

      window.location.href = "/";
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <h1>Login</h1>
        <form onSubmit={loginSubmit}>
          <h5>Email</h5>
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            value={user.email}
            onChange={onChangeInput}
          />
          <h5>Password</h5>
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            value={user.password}
            onChange={onChangeInput}
            autoComplete="on"
          />
          <button type="submit" className="auth__signInButton">
            Login
          </button>
        </form>
        <button
          type="submit"
          className="auth__signInButton"
          onClick={loginGuestSubmit}
        >
          Guest Login
        </button>
        <button
          type="submit"
          className="auth__signInButton"
          onClick={loginGuestAdminSubmit}
        >
          Guest Admin
        </button>
        <p>
          By continuing, you agree to Amazon's Conditions of Use and Privacy
          Notice.
        </p>
        <button
          className="auth__registerButton"
          onClick={() => navigate("/signup")}
        >
          Create your Amazon Account
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
