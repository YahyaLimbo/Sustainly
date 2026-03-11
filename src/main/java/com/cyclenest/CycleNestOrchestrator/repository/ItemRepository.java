package com.cyclenest.CycleNestOrchestrator.repository;

import com.cyclenest.CycleNestOrchestrator.model.Item;
import com.azure.spring.data.cosmos.repository.CosmosRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.azure.spring.data.cosmos.repository.Query; 
import org.springframework.data.repository.query.Param;

@Repository
public interface ItemRepository extends CosmosRepository<Item, String> {
    Page<Item> findByCategoryIgnoreCase(String category, Pageable pageable);
    Page<Item> findByLocationIgnoreCase(String location, Pageable pageable);
    Page<Item> findByCategoryIgnoreCaseAndLocationIgnoreCase(String category, String location, Pageable pageable);
    @Query("SELECT * FROM c WHERE c.item_id = @itemId")
    List<Item> findByItemId(@Param("itemId") String itemId);
    Long countByAvailable (boolean available); 
}
