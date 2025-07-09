import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    // const token = localStorage.getItem("token");
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjAxNDYxZC1kOGFhLTQ4NDktOGEwYS0wYTAyYTRmZDIwMTQiLCJpYXQiOjE3NTIwNTk4Njd9.4457POCIWVdzbGwyMnPvRenTSk9sgH6AQIj4yZZhcJM";
    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setLoading(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return { socket, loading };
}
