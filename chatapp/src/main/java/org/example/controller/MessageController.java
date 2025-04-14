package org.example.controller;

import org.example.model.Message;
import org.example.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // HTTP GET: Retrieve all messages
    @GetMapping
    public List<Message> getMessage() {
        return messageService.getAll();
    }

    // HTTP POST: Create a new message and send to WebSocket clients
    @PostMapping
    public Message postMessage(@RequestBody Message message) {
        Message savedMessage = messageService.save(message);
        messagingTemplate.convertAndSend("/topic/messages", savedMessage);
        return savedMessage;
    }

    // WebSocket endpoint for sending messages in real-time
    @MessageMapping("/sendMessage")
    public void sendMessage(Message message) {
        // Save the message to the database
        messageService.save(message);

        // Broadcast the message to all WebSocket clients
        messagingTemplate.convertAndSend("/topic/messages", message);
    }
}
