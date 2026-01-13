// palette: #DDe6ed, #9Db2bf, #536d82, #26374d
// palette 2: #d8d7ce, #00a6c0, #283b48, #222831
// palette 3: #19192e, #003e91, #002063, #041642
"use client";
import { useState } from "react";
import { Register } from "@/lib/services/api";
import Button from "@/components/ui/Button";
import Link from "next/link";

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
    <main className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 min-h-screen items-center justify-center bg-[#F9F6E5]">
      <section className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-5 flex flex-col bg-[#1b3153] text-white rounded-2xl p-8 gap-4 drop-shadow-xl">
        <h1 className="text-center text-[39.06px]">Create a New Account</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4"
        >
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="username"
            value={formData.username}
            onChange={handleChange}
            className="bg-[#eff5f6] w-1/2 text-[#2B2B2B] p-2 rounded-2xl"
          ></input>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
            className="bg-[#eff5f6] w-1/2 text-[#2B2B2B] p-2 rounded-2xl"
          ></input>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-[#eff5f6] w-1/2 text-[#2B2B2B] p-2 rounded-2xl"
          ></input>
          <div className="flex gap-1 pt-2">
            <p>Already have an account?</p>
            <Link href="/login" className="text-blue-400 border-b">
              Login Here
            </Link>
          </div>
          <Button
            type="submit"
            label="Submit"
            color="bg-[#f1cf79]"
            textColor="text-[#2B2B2B]"
          />
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </form>
      </section>
    </main>
  );
}
