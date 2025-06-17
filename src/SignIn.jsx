import React, { useState, useEffect } from "react";
import Card from "./components/card";
import logo from "./assets/img/logo.svg";


export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/admin/messages";
    }
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://sani3ywebapiv1.runasp.net/api/UserAuth/signin-normal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          EmailOrPhone:email,
          password
        })
      });

      const data = await response.json();

      if (response.ok && data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        window.location.href = "/admin/messages";
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Card className="cardSign mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center">
      <div className="max-w-50 mt-[10vh] w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <form 
        onSubmit={handleSignIn}
        >
          <img src={logo} alt="Logo" />

          <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
            تسجيل الدخول
          </h4>
          <p className="mb-9 ml-1 text-base text-gray-600">
           ادخل البريد الالكترونى وكلمه السر
          </p>

          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
            <p className="text-base text-gray-600 dark:text-white"></p>
            <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          </div>

          <input
            variant="auth"
            extra="mb-3"
            label="Email*"
            placeholder="mail@simmmple.com"
            id="email"
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            variant="auth"
            extra="mb-3"
            label="Password*"
            placeholder="Min. 8 characters"
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="mb-4 text-red-500">{error}</p>}

          <button className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
            Sign In
          </button>
        </form>
      </div>
    </Card>
  );
}
