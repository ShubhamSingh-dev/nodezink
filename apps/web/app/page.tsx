"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="bg-gray-100 p-4 border-gray-200 drop-shadow-md">
        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          type="text"
          placeholder="Room id"
          className="p-2 border-gray-400 border-2"
        ></input>
        <button
          onClick={() => {
            router.push(`/room/${roomId}`);
          }}
          className="bg-gray-200 p-2 border-gray-400 border-2 mx-2"
        >
          Join room
        </button>
      </div>
    </div>
  );
}
