import { createContext, useContext, useState } from 'react';

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)

    const connectSocket = (socketInstance) => {
        setSocket(socketInstance)
    }

    const disconnectSocket = () => {
        if (socket) {
            socket.close();
            setSocket(null)
        }
    }

    return (
        <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => {
    return useContext(SocketContext)
}