import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const Loginpage = () => {
  const [currState, setCurrentState] = useState("signup");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [isdatasubmitted, setIsDataSubmitted] = useState(false);
 


  const {login}=useContext(AuthContext);


  const onsubmitHandler = (e) => {
  e.preventDefault();

  if (currState === "signup" && !isdatasubmitted) {
    setIsDataSubmitted(true);
    return;
  }

  const payload =
    currState === "signup"
      ? { fullName, email, password, bio }
      : { email, password };

  login(currState, payload);
};

  return (
   <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-12 px-4 md:px-10 lg:px-20 bg-gray-900 backdrop-blur-2xl">
  {/* Left Section */}
 <div className="flex-1 flex justify-center items-center">
  <h2 className="bg-gradient-to-r from-purple-400 to-violet-600 bg-clip-text text-transparent font-extrabold text-4xl sm:text-5xl tracking-widest uppercase text-center drop-shadow-md">
    Connectify
  </h2>
</div>


  {/* Right Section (Form) */}
  <form
    onSubmit={onsubmitHandler}
    className="flex-1 max-w-xl w-full border-2 bg-white/10 text-white border-gray-500 p-8 md:p-10 flex flex-col gap-6 rounded-lg shadow-lg"
  >
    <h2 className="font-medium text-2xl flex justify-between items-center">
      {currState.toUpperCase()}
      {isdatasubmitted && (
        <img
          onClick={() => setIsDataSubmitted(false)}
          src={assets.arrow_icon}
          alt=""
          className="w-5 cursor-pointer"
        />
      )}
    </h2>

    {currState === "signup" && !isdatasubmitted && (
      <input
        onChange={(e) => setFullName(e.target.value)}
        value={fullName}
        type="text"
        className="p-3 border border-gray-500 rounded-md focus:outline-none text-black"
        placeholder="Username"
        required
      />
    )}

    {!isdatasubmitted && (
      <>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email address"
          required
          className="p-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Enter your password"
          required
          className="p-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
        />
      </>
    )}

    {currState === "signup" && isdatasubmitted && (
      <textarea
        onChange={(e) => setBio(e.target.value)}
        value={bio}
        rows={4}
        className="p-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
        placeholder="Provide a short bio"
        required
      ></textarea>
    )}

    <button
      type="submit"
      className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light rounded-md cursor-pointer"
    >
      {currState === "signup" ? "Create Account" : "Login"}
    </button>

    <div className="flex items-center gap-2">
      <input type="checkbox" />
      <p>Agree to the terms</p>
    </div>

    <div className="text-sm text-gray-500">
      {currState === "signup" ? (
        <p>
          Already have an account?{" "}
          <span
            onClick={() => {
              setCurrentState("login");
              setIsDataSubmitted(false);
            }}
            className="text-blue-400 underline cursor-pointer"
          >
            Login
          </span>
        </p>
      ) : (
        <p>
          Don't have an account?{" "}
          <span
            onClick={() => {
              setCurrentState("signup");
              setIsDataSubmitted(false);
            }}
            className="text-blue-400 underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      )}
    </div>
  </form>
</div>

  );
};

export default Loginpage;
