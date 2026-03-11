package com.cyclenest.CycleNestOrchestrator.repository;

import com.cyclenest.CycleNestOrchestrator.model.RentRequest;
import com.azure.spring.data.cosmos.repository.CosmosRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RentRepository extends CosmosRepository<RentRequest, String> {
    //List<RentRequest> findByRenterId(String RenterId);
}