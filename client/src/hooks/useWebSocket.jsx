import { useState, useEffect, useCallback, useRef } from 'react';
import io from 'socket.io-client';

// const SOCKET_SERVER_URL = import.meta.env.REACT_APP_SOCKET_SERVER_URL || 'http://localhost:5000';
const SOCKET_SERVER_URL = 'http://localhost:5000';

export const useWebSocket = () => {
    const [socket, setSocket] = useState(null);
    const [lastMessage, setLastMessage] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const reconnectAttempts = useRef(0);

    const connectSocket = useCallback(() => {
        const newSocket = io(SOCKET_SERVER_URL, {
            transports: ['websocket'],
            reconnection: false, // reconnection is handled manually instead
        });

        newSocket.on('connect', () => {
            console.log('WebSocket connected');
            setIsConnected(true);
            setError(null);
            reconnectAttempts.current = 0;
        });

        newSocket.on('disconnect', (reason) => {
            console.log('WebSocket disconnected:', reason);
            setIsConnected(false);
            setError(`Disconnected: ${reason}`);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Connection error:', err);
            setError(`Connection error: ${err.message}`);
        });

        newSocket.on('sensorData', (data) => {
            setLastMessage(data);
        });

        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    const reconnect = useCallback(() => {
        if (reconnectAttempts.current < 5) {
            reconnectAttempts.current += 1;
            console.log(`Attempting to reconnect... (Attempt ${reconnectAttempts.current})`);
            setTimeout(connectSocket, 5000 * reconnectAttempts.current);
        } else {
            setError('Max reconnection attempts reached. Please refresh the page.')
        }
    }, [connectSocket]);

    useEffect(() => {
        const cleanup = connectSocket();
        return cleanup;
    }, [connectSocket]);

    useEffect(() => {
        if (!isConnected && error) {
            reconnect();
        }
    }, [isConnected, error, reconnect]);

    const sendMessage = useCallback((message) => {
        if (socket) {
            socket.emit('message', message);
        }
    }, [socket]);

    return { lastMessage, sendMessage, isConnected, error };
};