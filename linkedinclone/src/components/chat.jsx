import { useEffect } from "react";
import { io } from "socket.io-client";

export default function ChatPage() {

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_URL, {
      transports: ["websocket"],
      auth: {
        userId: localStorage.getItem("id")
      }
    });

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
      console.log("Socket closed");
    };
  }, []);

  return <div>Chat window</div>;
}
