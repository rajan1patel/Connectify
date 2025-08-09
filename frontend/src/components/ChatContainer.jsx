import React, { useEffect, useRef, useState, useContext } from "react";
import assets from "../assets/assets";
import { formatMessageDate } from "../lib/utlis";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const scrollEnd = useRef(null);

  const {
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages,
  } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedUser ? (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden relative backdrop-blur-lg box-border">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        <img
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7 cursor-pointer"
          onClick={() => setSelectedUser(null)}
        />
        <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5" />
      </div>

      {/* Chat Area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-auto p-3 pb-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== authUser._id && "flex-row-reverse"
            }`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt="sent image"
                className="max-w-[230px] w-full border border-gray-700 rounded-lg overflow-hidden mb-8 object-cover"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-words bg-violet-500/30 text-white ${
                  msg.senderId !== authUser._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}
            {/* <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === authUser._id
                    ? assets.avatar_icon
                    : authUser?.profilePic || assets.avatar_icon
                }
               
                alt="avatar"
                className="w-7 rounded-full"
              />
              <p className="text-gray-500">{formatMessageDate(msg.createdAt)}</p>
            </div> */}
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

    {/* Input Area */}
<div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-4 bg-gray-800/90 backdrop-blur-lg shadow-md border-t border-gray-700">
  <div className="flex-1 flex items-center bg-gray-700 px-4 py-2 rounded-full border border-gray-500">
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
      type="text"
      placeholder="Send a message"
      className="flex-1 text-sm text-white placeholder-gray-300 bg-transparent focus:outline-none"
    />
    <input
      type="file"
      id="image"
      accept="image/png,image/jpeg"
      onChange={handleSendImage}
      hidden
    />
    <label htmlFor="image">
      <img
        src={assets.gallery_icon}
        className="w-5 h-5 mr-2 cursor-pointer opacity-80 hover:opacity-100"
        alt="Gallery"
      />
    </label>
  </div>
  <img
    onClick={handleSendMessage}
    src={assets.send_button}
    className="w-8 h-8 cursor-pointer hover:scale-105 transition"
    alt="Send"
  />
</div>

    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} alt="chat icon" className="max-w-16" />
      <p className="text-large font-medium text-white">
        Select a user to start chatting
      </p>
    </div>
  );
};

export default ChatContainer;
