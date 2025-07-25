import React from "react";
import assets from "../assets/assets";
import { useContext } from "react";
import ChatContainer from "./ChatContainer";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { useState } from "react";
import { useEffect } from "react";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    setMsgImages(
    messages.filter(msg => msg.image).map(msg => msg.image)
    )
  }, [messages]);


  return (
    selectedUser && (
      <div
        className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-auto overflow-x-hidden ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        <div className="pt-16 flex flex-col items-center justify-center font-light mx-auto text-xs">
          <img
             src={selectedUser.profilePic || assets.avatar_icon}
            alt=""
            className="w-10 aspect-[1/1] rounded-full"
          />
          <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
            <p className="w-2 h-2 rounded-full bg-green-500"> </p>
            {selectedUser.fullName}
          </h1>
          <p className="px-10 mx-auto">{selectedUser.bio}</p>
        </div>
        <hr className="border-[#ffffff50] my-4 " />
        <div className="px-5 text-xs">
          <p>media</p>
          <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
            {msgImages.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url, "_blank")}
                className="cursor-pointer rounded"
              >
                <img src={url} alt="" className="h-full rounded-md" />
              </div>
            ))}
          </div>
        </div>
        <button onClick={()=>logout()} className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-lght py-2 px-20 rounded-full cursor-pointer">
          Logout
        </button>
      </div>
    )
  );
};

export default RightSidebar;
