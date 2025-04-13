package org.example.service;

import org.example.model.Message;
import org.example.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message save(Message msg){
        return messageRepository.save(msg);
    }

    public List<Message> getAll(){
        return messageRepository.findAll(Sort.by(Sort.Direction.ASC,"timestamp"));
    }
}
