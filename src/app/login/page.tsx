"use client";

import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = () => {
    toast.success("Google sign-in clicked!");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Both fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      console.log("Login successful:", data);

      toast.success("Login successful!");

      router.push("/");
    } catch (error) {
      console.error("Error during login:", error);
      setError(error instanceof Error ? error.message : "Login failed");
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50 pt-20">
      <div className="w-full max-w-md shadow-lg rounded-xl p-8 bg-white">
        <h1 className="text-2xl font-semibold text-center mb-6">Welcome Back</h1>
        <div className="space-y-4">
          <div className="flex items-center border rounded-lg p-2">
            <FaEnvelope className="mr-2 text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              className="w-full outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex items-center border rounded-lg p-2 relative">
            <FaLock className="mr-2 text-gray-500" />
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className="w-full outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-4 top-3 cursor-pointer text-gray-500 hover:text-orange-500"
              onClick={() => setPasswordVisible(!passwordVisible)}
              aria-label="Toggle Password Visibility"
            >
              {passwordVisible ? <EyeOff size={24} /> : <Eye size={24} />}
            </span>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            className="w-full bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-orange-600 transition-all py-2 cursor-pointer"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
          <div className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <a href="/signup" className="text-black underline">
              Sign up here
            </a>
          </div>
          <div className="text-center text-sm text-gray-500 my-2">OR</div>
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-black text-white border rounded-full flex items-center justify-center py-2 cursor-pointer"
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}