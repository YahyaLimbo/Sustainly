package com.cyclenest.CycleNestOrchestrator.service;
import com.cyclenest.CycleNestOrchestrator.model.RentRequest;
import com.cyclenest.CycleNestOrchestrator.repository.RentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.azure.cosmos.models.PartitionKey; 

import java.util.Optional;
import java.util.UUID;

@Service
public class RentService {
    
    @Autowired
    private RentRepository rentRepository;

    @Autowired
    private RabbitMQProducer rabbitMQProducer;
    
    //create an item request
    public RentRequest createRequest(RentRequest request){
        if (request.getId() == null || request.getId().isEmpty()) {
            String shortId = "r" + UUID.randomUUID().toString().substring(0, 4);
            request.setId(shortId);
        }
        request.setStatus("pending"); 
        rabbitMQProducer.sendRentalRequest(request);
        return request;
    }
    //cancel item request
    public RentRequest cancelRequest(String id, String renterId){
        Optional<RentRequest> existing = rentRepository.findById(id, new PartitionKey(renterId));
        if (existing.isPresent()) {
            RentRequest requestToUpdate = existing.get();
            
            requestToUpdate.setStatus("cancelled");
            rabbitMQProducer.sendRentalRequest(requestToUpdate);
            return requestToUpdate;
    }else{
            throw new RuntimeException("Not found any existing request!");
        }   
    }
}
