  // components/Session/ChatWindow.tsx

  import React, { useState, useEffect, useRef, useCallback } from 'react';
  import { io, Socket } from 'socket.io-client';
  import { motion, AnimatePresence } from 'framer-motion';
  import { useAuth } from '@/hooks/useAuth';
  import styles from '@/styles/components/Session/ChatWindow.module.scss';
  import Timer from './Timer';
  import ErrorBoundary from '@/components/ErrorBoundry';
  import { FaPaperPlane, FaExclamationTriangle } from 'react-icons/fa';
  import { useRouter } from 'next/router';

  interface ChatWindowProps {
    sessionId: string;
    sessionerInfo: SessionInfo;
    onSessionEnd: () => void;
  }

  interface ChatMessage {
    id: string;
    role: string;
    content: string;
    timestamp: string;
    userId?: string;
    username?: string;
  }

  interface SessionInfo {
    session_uuid: string;
    session_start: string;
    session_end: string;
    // Add other session info fields as needed
  }

  const ChatWindow: React.FC<ChatWindowProps> = ({ sessionId, sessionerInfo, onSessionEnd }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user, getAuthToken } = useAuth();
    const [firstTime, setFirstTime] = useState(true);
    const [timerFalse, setTimerFalse] = useState(true);
    const [reloadTimer, setReloadTimer] = useState(false);
    const router = useRouter();

    // Using refs to keep track of the latest state values
    const tokenRef = useRef<string | null>(null);
    const apiKeyRef = useRef<string | undefined>(process.env.NEXT_PUBLIC_API_KEY);
    const sessionIdRef = useRef<string>(sessionId);
    const userRef = useRef<typeof user | null>(user);

    // Update refs whenever dependencies change
    useEffect(() => {
      tokenRef.current = getAuthToken();
      apiKeyRef.current = process.env.NEXT_PUBLIC_API_KEY;
      sessionIdRef.current = sessionId;
      userRef.current = user;
    }, [getAuthToken, sessionId, user]);

    const connectSocket = useCallback(() => {
      const token = tokenRef.current;
      const apiKey = apiKeyRef.current;

      // Check if any authentication information is missing
      if (!token || !apiKey || !sessionId || !user) {
        // Delay the setting of connection error by 3 seconds
        setTimeout(() => {
          // Double-check using refs to ensure current state is checked
          if (!tokenRef.current || !apiKeyRef.current || !sessionIdRef.current || !userRef.current) {
            setConnectionError('Missing authentication information. Please ensure you are logged in.');
          }
        }, 3000); // Wait for 3 seconds
        return;
      }

      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
        auth: {
          token,
          apiKey,
          uuid: sessionId
        },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      newSocket.on('connect', () => {
        console.log('Connected to socket server');
        if (firstTime) {  newSocket.emit('chat_message', { text: "Let's start a new chat therapy session together." });}
        setIsConnected(true);
        setConnectionError(null);
        newSocket.emit('join_room', sessionId);
      });

      newSocket.on('connect_error', (error: Error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
        setConnectionError(`Connection error: ${error.message}. Please try again.`);
      });

      newSocket.on('room_joined', (data: { roomId: string; message: string }) => {
        console.log('Room joined:', data);
        addMessage({
          id: Date.now().toString(),
          role: 'system',
          content: `You've joined room ${data.roomId}`,
          timestamp: new Date().toISOString()
        });
      });

      newSocket.on('chat_message', (data: { userId: string; username: string; message: ChatMessage }) => {
        addMessage({
          ...data.message,
          id: Date.now().toString(),
          userId: data.userId,
          username: data.username
        });
        if(firstTime) setFirstTime(false);
      });

      newSocket.on('chat_history', (history: ChatMessage[]) => {
        setMessages(history.map(msg => ({ ...msg, id: Date.now().toString() + Math.random() })));
      });

      newSocket.on('session_info_update', (info: SessionInfo) => {
        // Handle session info update if needed
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Disconnected:', reason);
        setIsConnected(false);
        if (reason === 'io server disconnect') {
          setConnectionError('The server has forcefully disconnected the connection.');
        } else {
          setConnectionError('Connection lost. Attempting to reconnect...');
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }, [sessionId, user, getAuthToken]);

    useEffect(() => {
      connectSocket();
      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }, [connectSocket]);

    useEffect(() => { 
      if (!firstTime) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" }); }
    }, [messages]);

    useEffect(() => {
      if (socket && isConnected) {
        socket.emit('get_chat_history');
      }
    }, [socket, isConnected]);

    const addMessage = useCallback((newMessage: ChatMessage) => {
      setMessages(prevMessages => {
        const isDuplicate = prevMessages.some(msg =>
          msg.content === newMessage.content &&
          msg.timestamp === newMessage.timestamp &&
          msg.role === newMessage.role
        );
        if (isDuplicate) return prevMessages;
        return [...prevMessages, newMessage];
      });
    }, []);

    const handleSendMessage = useCallback((e: React.FormEvent) => {
      e.preventDefault();
      if (inputMessage.trim() && socket && isConnected && user && !sessionExpired) {
        const messageToSend: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: inputMessage,
          timestamp: new Date().toISOString(),
        };
        socket.emit('chat_message', { text: inputMessage });
        addMessage(messageToSend);
        setInputMessage('');
      }
    }, [inputMessage, socket, isConnected, user, sessionExpired, addMessage]);

    const handleReconnect = useCallback(() => {
      if (socket) {
        socket.disconnect();
      }
      connectSocket();
    }, [socket, connectSocket]);

    const handleTimerEnd = async () => {
      setSessionExpired(true);
      setTimerFalse(false);
      handleReloadTimer();
    };

    const handleReloadTimer = async () => {
      if (!reloadTimer) {

       addMessage({
        id: Date.now().toString(),
        role: 'system',
        content: 'Chat session has ended.',
        timestamp: new Date().toISOString()
      });
        setReloadTimer(true);
    
        setTimeout(() => {
          router.push({
            pathname: router.pathname,
            query: router.query,
          });
        }, 15000); // Delay of 15000 milliseconds (15 seconds)
      }
    };
    

    const isInputDisabled = !isConnected || sessionExpired;

    const messageVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    };

    const renderMessage = useCallback((msg: ChatMessage) => {
      let displayName = msg.username || msg.role; // Fallback to role if username is not provided
      if (msg.role === 'user') {
        displayName = 'You'; // User's messages
      } else if (msg.role === 'assistant') {
        displayName = 'Prism AI'; // Assistant's messages
      }
    
      return (
        <motion.div
          key={msg.id}
          variants={messageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
          className={`${styles.message} ${msg.userId === user?.id ? styles.ownMessage : styles.systemMessage}`}
        >
          <span className={styles.username}>{displayName}</span>
          <span className={styles.messageContent}>{msg.content}</span>
          <span className={styles.timestamp}>
            {new Date(msg.timestamp).toLocaleTimeString()}
          </span>
        </motion.div>
      );
    }, [user?.id]);

    return (
      <div className={styles.chatWindow} >
       {timerFalse ? (<ErrorBoundary>
          {sessionerInfo && (
            <div>
              <Timer endTime={new Date(sessionerInfo.session_end).getTime()} onTimerEnd={handleTimerEnd} />
            </div>
          )}
        </ErrorBoundary>):(<></>)} 

        <motion.div
          className={styles.connectionStatus}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >

        </motion.div>

        <AnimatePresence>
          {connectionError && (
            <motion.div
              className={styles.errorMessage}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FaExclamationTriangle /> Error: {connectionError}
              <motion.button
                onClick={handleReconnect}
                className={styles.reconnectButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reconnect
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.messageList}>
          <AnimatePresence>
            {messages.map(renderMessage)}
          </AnimatePresence>
          <div ref={messagesEndRef} /> 
          <div />
        </div>

        <form onSubmit={handleSendMessage} className={styles.inputForm}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className={styles.inputField}
            disabled={isInputDisabled}
          />
          <motion.button
            type="submit"
            className={styles.sendButton}
            disabled={isInputDisabled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPaperPlane /> Send
          </motion.button>
        </form>
      </div>
    );
  };

  export default ChatWindow;
