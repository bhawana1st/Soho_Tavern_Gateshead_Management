import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      navigate("/users");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-cream">
      <div className="card w-full max-w-md p-8 animate-fadeIn mt-12">
        <h2 className="text-2xl font-serif text-center text-burgundy mb-6">
          Create new account
        </h2>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            name="name"
            placeholder="Full name"
            required
            className="border px-3 py-2 rounded-md"
            onChange={handle}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="border px-3 py-2 rounded-md"
            onChange={handle}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="border px-3 py-2 rounded-md"
            onChange={handle}
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="btn-primary mt-2">Register</button>
        </form>
      </div>
    </div>
  );
}
