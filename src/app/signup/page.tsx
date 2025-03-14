"use client";

import { useState, useRef } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const userAuthThroughServer = async (
    fullname: string,
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullname, username, email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const data = await res.json();
      console.log("Signup successful:", data);
      return data;
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const { fullname, username, email, password } = Object.fromEntries(formData) as {
      fullname: string;
      username: string;
      email: string;
      password: string;
    };

    if (fullname.length < 5) return toast.error("Fullname must be at least 5 letters long");
    if (!email) return toast.error("Enter Email");
    if (!password) return toast.error("Enter Password");

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) return toast.error("Email is invalid");

    if (password !== confirmPassword) return toast.error("Passwords do not match");

    setLoading(true);

    try {
      await userAuthThroughServer(fullname, username, email, password);
      toast.success("Signup successful!");
      router.push("/"); // Redirect to the home page after successful signup
    } catch (error) {
      toast.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const value = e.target.value;
    if (type === "pass") {
      setPassword(value);
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/;

      if (!regex.test(value)) {
        setPasswordError(
          "Password should be 6 to 20 characters long with at least 1 special character , 1 numeric, 1 lowercase, and 1 uppercase letter"
        );
      } else {
        setPasswordError("");
      }
    } else if (type === "con_pass") {
      setConfirmPassword(value);
      if (value !== password) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        setConfirmPasswordError("");
      }
    }
  };

  const handleGoogleSignIn = () => {
    toast.success("Google sign-in clicked!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50 pt-20">
      <div className="w-full max-w-md shadow-lg rounded-xl p-8 bg-white">
        <h1 className="text-2xl font-semibold text-center mb-6">Join Us Today</h1>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border rounded-lg p-2">
            <FaUser className="mr-2 text-gray-500" aria-label="Full Name Icon" />
            <input
              type="text"
              name="fullname"
              placeholder="Name"
              className="w-full outline-none"
              required
              aria-label="Full Name"
            />
          </div>
          <div className="flex items-center border rounded-lg p-2">
            <FaUser className="mr-2 text-gray-500" aria-label="Username Icon" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full outline-none"
              required
              aria-label="Username"
            />
          </div>
          <div className="flex items-center border rounded-lg p-2">
            <FaEnvelope className="mr-2 text-gray-500" aria-label="Email Icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full outline-none"
              required
              aria-label="Email"
            />
          </div>
          <div className="flex items-center border rounded-lg p-2 relative">
            <FaLock className="mr-2 text-gray-500" aria-label="Password Icon" />
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full outline-none"
              value={password}
              onChange={(e) => validatePassword(e, "pass")}
              required
              aria-label="Password"
            />
            <span
              className="absolute right-4 top-3 cursor-pointer text-gray-500 hover:text-orange-500"
              onClick={() => setPasswordVisible(!passwordVisible)}
              aria-label="Toggle Password Visibility"
            >
              {passwordVisible ? <EyeOff size={24} /> : <Eye size={24} />}
            </span>
          </div>
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          <div className="flex items-center border rounded-lg p-2 relative">
            <FaLock className="mr-2 text-gray-500" aria-label="Confirm Password Icon" />
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full outline-none"
              value={confirmPassword}
              onChange={(e) => validatePassword(e, "con_pass")}
              required
              aria-label="Confirm Password"
            />
            <span
              className="absolute right-4 top-3 cursor-pointer text-gray-500 hover:text-orange-500"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              aria-label="Toggle Confirm Password Visibility"
            >
              {confirmPasswordVisible ? <EyeOff size={24} /> : <Eye size={24} />}
            </span>
          </div>
          {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-[80%] bg-orange-500 mt-2 text-white px-4 py-3 rounded-full text-lg font-medium hover:bg-orange-600 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>
        <div className="text-center text-sm text-gray-500 my-2">OR</div>
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-black text-white border rounded-full flex items-center justify-center py-2 cursor-pointer"
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          Continue with Google
        </button>
        <p className="text-center text-sm text-gray-500 mt-2">
          Already a member?{" "}
          <a href="/login" className="text-black underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}