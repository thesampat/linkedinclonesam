import React, { useState } from "react";
import { useLocation, useParams } from "react-router";
import { socket } from "../socket";
import { useGetLoginUser } from "../customHooks";
import { useEffect } from "react";
import { getChats } from "../services/chatServices";

const createRoom = (me, otherUser) => {
  return [me, otherUser].sort().join("_");
};

export default function ChatPage() {
  const [text, setText] = useState("");
  const [messages, setmessages] = useState()
  const { user, name, picture } = useParams()
  const loginUser = useGetLoginUser()
  const [roomid, setroomid] = useState()

  useEffect(() => {
    if (user && loginUser?._id) {
      console.log(loginUser?._id, user, 'shou ddifff')
      let roomIdInstant = createRoom(loginUser?._id, user);
      setroomid(roomIdInstant)
      socket.emit('join-room', roomIdInstant)
      getChats(user).then(f => {
        setmessages(f?.data)
        console.log('settined')
      })
    }
    
  }, [user, loginUser?._id])

  useEffect(()=>{
    socket.on('chat', (msg)=>{
      setmessages(prev=>[...prev, msg])
    })
  }, [0])

  const handleSend = () => {
    if (!text.trim()) return;
    socket.timeout(5000).emit("chat", { sender: loginUser?._id, receiver: user, message: text, roomId:roomid });
    setText('')
  };


  return (
 <div className="flex flex-col h-[90vh] bg-white shadow-lg rounded-xl overflow-hidden md:max-w-4/6 lg:max-w-3/6 mx-auto">

  {/* Header */}
  <div className="p-4 border-b flex items-center gap-3 bg-blue-600 text-white shadow-sm">
    <img src={picture} alt="" className="w-10 h-10 rounded-full shadow" />
    <div>
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="text-sm opacity-80">Active now</p>
    </div>
  </div>

  {/* Messages Area */}
  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">

    {messages?.map((msg, idx) => {
      const isMe = msg?.sender === loginUser?._id;

      return (
        <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`} key={idx}>
          
          {/* Username */}
          <p className="text-xs text-gray-500 mb-1">
            {isMe ? loginUser?.name :  name}
          </p>
          
          {/* Bubble */}
          <div
            className={`max-w-xs px-4 py-2 rounded-xl text-sm shadow-sm 
            ${isMe 
              ? "bg-blue-600 text-white rounded-br-none" 
              : "bg-white text-gray-800 border rounded-bl-none"}`}
          >
            {msg.message}
          </div>
        </div>
      );
    })}

  </div>

  {/* Input Box */}
  <div className="p-3 border-t bg-white flex items-center gap-2 shadow-inner">
    <input
      type="text"
      className="flex-1 px-3 py-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Type a message..."
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSend()}
    />

    <button
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold active:scale-95 shadow-sm hover:shadow-md transition-all"
      onClick={handleSend}
    >
      Send
    </button>
  </div>

</div>

  );
}
