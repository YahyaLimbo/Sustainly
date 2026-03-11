package com.cyclenest.CycleNestOrchestrator.service;

import com.cyclenest.CycleNestOrchestrator.config.RabbitMQConfig;
import com.cyclenest.CycleNestOrchestrator.model.RentRequest;
import com.fasterxml.jackson.core.JsonProcessingException; 
import com.fasterxml.jackson.databind.ObjectMapper;    
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RabbitMQProducer {

    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    @Autowired
    private ObjectMapper objectMapper;

    public void sendRentalRequest(RentRequest request) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(request);
            rabbitTemplate.convertAndSend(RabbitMQConfig.QUEUE_NAME, jsonMessage);
            
            System.out.println("Sent JSON to Queue: " + jsonMessage);
            
        } catch (JsonProcessingException e) {
            System.err.println("Error converting object to JSON: " + e.getMessage());
            e.printStackTrace();
        }
    }
}