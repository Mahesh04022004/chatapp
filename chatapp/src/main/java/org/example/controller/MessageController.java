package org.example.controller;

import org.example.model.Message;
import org.example.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping
    public ResponseEntity<?> postMessage(@RequestBody Message message){
        return ResponseEntity.ok(messageService.save(message));
    }

    @GetMapping
    public ResponseEntity<?> getMessage(){
        return ResponseEntity.ok(messageService.getAll());
    }
}
