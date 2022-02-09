import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../LoginPage/LoginPage.css";
import axios from "axios";
import {toast} from 'react-toastify'


function SignupPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const registerSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/user/register", { ...user });
      localStorage.setItem("firstLogin", true);
      window.location.href = "/";
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <h1>Sign Up</h1>
        <form onSubmit={registerSubmit}>
          <h5>Username</h5>
          <input
            name="name"
            type="text"
            required
            onChange={onChangeInput}
            placeholder="Name"
          />
          <h5>Email</h5>
          <input
            name="email"
            type="email"
            required
            onChange={onChangeInput}
            placeholder="Email"
          />
          <h5>Password</h5>
          <input
            name="password"
            type="password"
            required
            onChange={onChangeInput}
            placeholder="Password"
          />

          <button type="submit" className="auth__signInButton">
            Sign Up
          </button>
        </form>

        <p>
          By continuing, you agree to Amazon's Conditions of Use and Privacy
          Notice.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="auth__registerButton"
        >
          Sign Into your Account
        </button>
      </div>
    </div>
  );
}

export default SignupPage;
