"use client";
import { useEffect, useState } from "react";
import { Login } from "@/lib/services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const { token, user } = await Login(formData);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // set token & trigger redirect
      setUserToken(token);
      setSuccess(true);
    } catch (error: any) {
      console.log("Login Failed: ", error);

      setError(error.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    if (success && userToken) {
      router.push("/dashboard");
    }
  }, [success, userToken, router]);

  return (
    <main className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 min-h-screen items-center justify-center bg-[#F9F6E5]">
      <section className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-5 flex flex-col bg-[#1b3153] text-white rounded-2xl p-8 gap-4 drop-shadow-xl">
        <h1 className="text-center text-[39.06px]">Login</h1>
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
          <div className="flex gap-1 pt-2">
            <p>Don't have an account yet?</p>
            <Link href="/register" className="text-blue-400 border-b">
              Register Here
            </Link>
          </div>
          <Button
            type="submit"
            label="Login"
            color="bg-[#f1cf79]"
            textColor="text-[#2B2B2B]"
          />
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </section>
    </main>
  );
}
