"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
  messages,
  id,
}: {
  messages: { message: string }[];
  id: string;
}) {
  const [chats, setChats] = useState(messages);
  const [currentMessage, setCurrentMessage] = useState("");
  const { socket, loading } = useSocket();

  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: id,
        })
      );

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "chat") {
          setChats((c) => [...c, { message: parsedData.message }]);
        }
      };
    }
  }, [socket, loading, id]);

  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center">
      <div>
        {chats.map((m) => (
          <div className="m-2 border-gray-400 border p-2 rounded-md font-semibold">
            {m.message}
          </div>
        ))}

        <input
          className="p-2 border-gray-400 border-2 m-2"
          placeholder="Message"
          type="text"
          value={currentMessage}
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }}
        ></input>
        <button
          className="bg-gray-200 p-2 border-gray-400 border-2 mx-2"
          onClick={() => {
            socket?.send(
              JSON.stringify({
                type: "chat",
                roomId: id,
                message: currentMessage,
              })
            );

            setCurrentMessage("");
          }}
        >
          Send message
        </button>
      </div>
    </div>
  );
}
