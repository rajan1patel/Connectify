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
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* left */}
      <img src={assets.logo_big} alt="" className="w-[min(30vw,250px)]" />

      {/* right */}
      <form onSubmit={onsubmitHandler}
        action=""
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          {isdatasubmitted && <img onClick={()=>setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className="w-5 cursor-pointer" />}

          
        </h2>
        {currState === "signup" && !isdatasubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className="p-2 border border-gray-500 rounded-md focus:outline-none text-black"
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
              placeholder="email address"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder=" enter your password"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
          </>
        )}
        {currState === "signup" && isdatasubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-gray-500 rounded-md fcus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            id=""
            placeholder="Provide a shortbio"
            required
          ></textarea>
        )}

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-lght rounded-md cursor-pointer"
        >
          {currState === "signup" ? "create Account" : "Login"}
        </button>

        <div>
          <input type="checkbox"  />
          <p>Agree to the terms </p>
        </div>
        <div className="flex flex-col gap-2">
          {currState === "signup" ? (
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrentState("login");
                  setIsDataSubmitted(false);
                }}
                className="text-blue-500 cursor-pointer"
              >
                Login
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <span
                onClick={() => {
                  setCurrentState("signup");
                  setIsDataSubmitted(false);
                }}
                className="text-blue-500 cursor-pointer"
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
