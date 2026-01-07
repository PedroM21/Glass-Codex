// palette: #DDe6ed, #9Db2bf, #536d82, #26374d
// palette 2: #d8d7ce, #00a6c0, #283b48, #222831
// palette 3: #19192e, #003e91, #002063, #041642
"use client";
import { useState } from "react";
import { Register } from "@/lib/services/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const { token, user } = await Register(formData);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setSuccess("Registration successful!");
    } catch (error: any) {
      console.log("Registering failed: ", error);

      setError(error.message || "Something went wrong.");
    }
  };

  return (
    <div className="border border-black min-h-screen">
      <main className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 min-h-screen items-center justify-center">
        <section className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-4 flex flex-col bg-[#26374d] text-white rounded-xl p-8 gap-4">
          <h1 className="text-center">Register Page</h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-4"
          >
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="bg-[#DDe6ed] w-1/2 text-black p-2"
            ></input>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="bg-[#DDe6ed] w-1/2 text-black p-2"
            ></input>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-[#DDe6ed] w-1/2 text-black p-2"
            ></input>
            <button type="submit" className="bg-[#9Db2bf] p-2 cursor-pointer">
              Submit
            </button>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
          </form>
        </section>
      </main>
    </div>
  );
}
