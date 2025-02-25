"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "../app/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email) return "Email is required";
    if (!emailPattern.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); //prevent page reload when enter key is pressed
    setEmailError("");
    setPasswordError("");

    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    if (emailValidationError || passwordValidationError) {
      setEmailError(emailValidationError);
      setPasswordError(passwordValidationError);
      return;
    }

    try {
      console.log("Attempting login...");
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful! Redirecting...");
      router.push("/dashboard"); // Next.js redirection

      setEmailError("");
      setPasswordError("");
    } catch (error: any) {
      console.error("Login error:", error.code, error.message);
      if (error.code === "auth/user-not-found") {
        setEmailError("User not found");
      } else if (error.code === "auth/wrong-password") {
        setPasswordError("Invalid password");
      } else {
        setEmailError("Login failed. Please try again later");
      }
    }
  };

  return (
    <div className="h-screen grid grid-cols-2">
      <div className="bg-bg-yellow"></div>
      <div className="bg-bg-light-brown"></div>
      <section className="absolute inset-0 flex justify-center items-center">
        <div className="flex flex-col justify-center bg-white w-3/4 h-2/3 max-w-xl rounded-3xl p-10">
          <div className="flex flex-col gap-1">
            <h1 className="text-sm text-bg-brown">
              Welcome to
              <strong className="text-bg-light-brown font-bold"> BBNKA</strong>
            </h1>
            <h2 className="text-3xl font-black text-bg-brown">Sign In</h2>
            <h3 className="text-sm font-thin text-bg-brown">
              Enter your login details to continue
            </h3>
          </div>
          <form className="flex flex-col justify-center"
                onSubmit={handleLogin}>
            <div className="flex flex-col gap-1 pt-8 pb-4">
              <label className="text-xs font-extralight ml-3 text-bg-brown">Email Address</label>
              <input
                type="email"
                className={`w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border ${
                  emailError ? "border-red-500" : "border-slate-200"
                } rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <p className="text-red-500 text-xs mt-1 ml-3">{emailError}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-extralight ml-3 text-bg-brown">Password</label>
              <input
                type="password"
                className={`w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border ${
                  passwordError ? "border-red-500" : "border-slate-200"
                } rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <p className="text-red-500 text-xs mt-1 ml-3">{passwordError}</p>}
            </div>
            <div className="flex justify-end pt-2 pb-10">
              <button className="text-xs font-bold underline text-bg-brown">
                Forgot Password?
              </button>
            </div>
            <button
              className="w-full rounded-md bg-bg-light-brown py-2 px-4 border border-transparent font-bold text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:shadow-none active:bg-hover-light-brown hover:bg-hover-light-brown active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              onClick={handleLogin}
            >
              LOGIN
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}