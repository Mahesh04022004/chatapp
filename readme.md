
## 🔥 Project Stack (Full Breakdown)

| Layer          | Tech Stack                     | Role                                                           |
|----------------|--------------------------------|----------------------------------------------------------------|
| Frontend       | React + Bootstrap              | UI, handle messages and real-time updates                      |
| Backend        | Spring Boot + WebSocket (STOMP) | APIs + real-time chat over WebSocket                           |
| Database       | MySQL                          | Store messages + user data                                     |
| Auth (later)   | Spring Security + JWT          | Secure endpoints and protect routes                            |



---

## ✅ **Phase 1: Backend Setup (Spring Boot + MySQL)**

### 🎯 Goal:
Set up your backend to expose REST APIs for sending and receiving messages.

---

### 🔧 Step 1: Project Setup using Spring Initializr

- **Project**: Maven
- **Language**: Java
- **Spring Boot Version**: 3.x
- **Dependencies**:
  - Spring Web
  - Spring Data JPA
  - MySQL Driver
  - Lombok
  - Spring Boot DevTools (optional for hot reload)


---

### 🧠 Why this setup?

- **Spring Web** → To expose REST endpoints (`@RestController`)
- **JPA + MySQL** → For database mapping (saving messages)
- **Lombok** → Cleaner code (auto-generates getters/setters)
- **DevTools** → Auto-restart when changes happen

---

### 📁 Directory Structure (Before WebSocket & Auth)
```
src/
 └── main/java/com/mahesh/chatapp/
     ├── controller/
     ├── model/
     ├── repository/
     ├── service/
 └── resources/
     └── application.properties
```

---



























Absolutely! Let's dive into **Phase 3** and make this a real-time chat app with **WebSocket + STOMP**. 🚀

### Here’s the high-level plan for adding real-time updates:

1. **WebSocket Setup**: 
   - On the backend, we'll set up WebSocket using Spring Boot with **STOMP** (Simple Text Oriented Messaging Protocol) for message delivery.
   - On the frontend, we'll use a WebSocket client to send and receive messages in real time.

2. **STOMP Protocol**: 
   - We'll use **STOMP** over WebSocket to handle message exchanges.
   - STOMP will allow you to subscribe to message channels and broadcast messages.

3. **Frontend Integration**:
   - On the frontend, we'll create a WebSocket connection that listens for incoming messages.
   - When you send a message, it will instantly appear for everyone subscribed.

### Here’s what you’ll need to do:

---

### **Backend: Spring Boot - WebSocket + STOMP**

1. **Add dependencies** to your `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.messaging</groupId>
    <artifactId>spring-messaging</artifactId>
</dependency>
```

2. **Configure WebSocket in Spring Boot**:

Create a WebSocket configuration class that enables STOMP.

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple in-memory broker for message handling
        config.enableSimpleBroker("/topic");
        // Set application destination prefix
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register the "/chat" endpoint to establish the WebSocket connection
        registry.addEndpoint("/chat").withSockJS();
    }
}
```

3. **Create a Controller** to handle incoming and outgoing messages:

```java
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
    public String sendMessage(String message) {
        // This method will receive messages and broadcast them to all connected clients
        return message;
    }
}
```

---

### **Frontend: React with WebSocket and STOMP**

1. **Install WebSocket Client**: Use a WebSocket library like `@stomp/stompjs` for easy integration.

```bash
npm install @stomp/stompjs
```

2. **Set up WebSocket connection in React**:

Here's an example of how you can integrate WebSocket with STOMP in your `ChatWindow.jsx` component:

```jsx
import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [client, setClient] = useState(null);

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: 'ws://localhost:9921/chat',
      onConnect: () => {
        stompClient.subscribe('/topic/messages', (msg) => {
          setMessages((prevMessages) => [...prevMessages, msg.body]);
        });
      },
      onDisconnect: () => console.log('Disconnected from WebSocket'),
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [client]);

  const sendMessage = () => {
    if (client && message.trim()) {
      client.publish({ destination: '/app/sendMessage', body: message });
      setMessage('');
    }
  };

  return (
    <div>
      <div id="messages">
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatWindow;
```

---

### **What’s Happening in the Frontend Code:**
1. **STOMP Client**: 
   - Establishes a WebSocket connection to `ws://localhost:9921/chat`.
   - Subscribes to the `/topic/messages` endpoint to receive messages in real time.
   
2. **Message Sending**: 
   - When you type a message and hit "Send", it publishes the message to the `/app/sendMessage` endpoint on the backend.
   
3. **Message Receiving**:
   - Once a message is sent, it appears instantly because the frontend is subscribed to the `/topic/messages` endpoint.

---

### **Final Steps:**

- **Test your application**: Run both the backend (Spring Boot) and frontend (React).
- **Send and receive messages** in real time, just like WhatsApp/Discord!

---

Let me know if you want more details on any specific step, or if you encounter any issues while implementing it! We’re almost there! 🔥
