package com.cyclenest.CycleNestOrchestrator.repository;

import com.cyclenest.CycleNestOrchestrator.model.RentRequest;
import com.azure.spring.data.cosmos.repository.CosmosRepository;
import org.springframework.stereotype.Repository;

import com.azure.spring.data.cosmos.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface RentRepository extends CosmosRepository<RentRequest, String> {
    @Query("SELECT * FROM c WHERE c.renter_id = @renterId")
    List<RentRequest> findByRenterId(@Param("renterId") String renterId);
}