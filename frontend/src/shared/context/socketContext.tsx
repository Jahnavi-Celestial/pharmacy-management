import React, { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../hooks/useAuth"; 

export const SocketContext = createContext<Socket | null>(null)

export const SocketProvider = ({ children }: {children: React.ReactNode}) => {
  const { userId } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    if (!userId) {
      setSocket(null)
      return
    }

    const socketInstance = io(import.meta.env.VITE_BACKEND_URL)

    socketInstance.on("connect", () => {
      console.log(`Connected! Socket ID: ${socketInstance.id}`)
      socketInstance.emit("join_room", userId)
    })

    setSocket(socketInstance)

    return () => {
      console.log("Disconnecting socket...")
      socketInstance.disconnect()
    }
  }, [userId])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}
