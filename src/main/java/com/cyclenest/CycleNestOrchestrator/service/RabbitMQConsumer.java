package com.cyclenest.CycleNestOrchestrator.service;

import com.cyclenest.CycleNestOrchestrator.config.RabbitMQConfig;
import com.cyclenest.CycleNestOrchestrator.model.RentRequest;
import com.cyclenest.CycleNestOrchestrator.repository.ItemRepository;
import com.cyclenest.CycleNestOrchestrator.model.Item;
import com.cyclenest.CycleNestOrchestrator.repository.RentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List; 

@Service
public class RabbitMQConsumer {
    
    @Autowired private ItemRepository itemRepository;
    @Autowired private RentRepository rentRepository;
    @Autowired private OsrmServiceDistance distanceService;
    @Autowired private ObjectMapper objectMapper;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void processRentalRequest(String message) {
        
        try {
            RentRequest request = objectMapper.readValue(message, RentRequest.class);
            List<Item> items = itemRepository.findByItemId(request.getItemId());
            
            if (!items.isEmpty()) {
                Item item = items.get(0); 
                
                rentRepository.save(request);
                System.out.println("Successfully saved RentRequest. ID: " + request.getId() + ", Renter: " + request.getRenterId());
                
            } 
            else {
                System.err.println("Item NOT FOUND in Database list: " + request.getItemId());
                rentRepository.save(request);
                System.out.println("Saved RentRequest anyway (Item missing). ID: " + request.getId() + ", Renter: " + request.getRenterId());
            }

        } catch (Exception e) {
            System.err.println("Error processing JSON message: " + e.getMessage());
            e.printStackTrace();
        }
    }
}