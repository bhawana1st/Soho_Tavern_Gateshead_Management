import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", form);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-cream">
      <div className="card w-full max-w-md p-8 animate-fadeIn mt-12">
        <h2 className="text-2xl font-serif text-center text-burgundy mb-6">
          Welcome back
        </h2>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handle}
            required
            className="border px-3 py-2 rounded-md"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handle}
            required
            className="border px-3 py-2 rounded-md"
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="btn-primary mt-2">Login</button>
        </form>
      </div>
    </div>
  );
}
