import axios from "axios";
import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [sender, setSender] = useState('');
  const [content, setContent] = useState('');
  const [client, setClient] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("http://localhost:9921/api/messages");
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages", err);
      }
    };

    fetchMessages();

    const stompClient = new Client({
      brokerURL: "ws://localhost:9921/chat", // No SockJS fallback
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to WebSocket");
        stompClient.subscribe("/topic/messages", (msg) => {
          const newMsg = JSON.parse(msg.body);
          setMessages((prev) => [...prev, newMsg]);
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (stompClient) stompClient.deactivate();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (client && sender && content) {
      const messageObject = {
        sender,
        content,
      };

      client.publish({
        destination: "/app/sendMessage",
        body: JSON.stringify(messageObject),
      });

      setContent('');
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">💬 Mahesh's Chat App</h3>
      <div
        className="border p-3 rounded bg-light mb-3"
        style={{ height: '400px', overflowY: 'scroll' }}
      >
        <div className="mb-2">
          {messages.map((msg) => (
            <div key={msg.id} className="mb-2">
              <strong>{msg.sender}:</strong> {msg.content}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={sendMessage}>
        <div className="row g-2">
          <div className="col-md-3">
            <input
              type="text"
              placeholder="Your name"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-7">
            <input
              type="text"
              placeholder="Type your message"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100">Send</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
