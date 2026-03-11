package com.cyclenest.CycleNestOrchestrator.controller;
import com.cyclenest.CycleNestOrchestrator.service.OsrmServiceDistance;
import com.cyclenest.CycleNestOrchestrator.model.Item;
import com.cyclenest.CycleNestOrchestrator.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import com.cyclenest.CycleNestOrchestrator.repository.ItemRepository;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/items")
public class ItemController {

    @Autowired
    private ItemService itemService;
    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private OsrmServiceDistance distanceService;

    @GetMapping
    public ResponseEntity<Page<Item>> searchItems(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            Pageable pageable) {
        Page<Item> items = itemService.searchItems(category, location, pageable);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> findItemById(
            @PathVariable String id,
            @RequestParam(required = false) Double userLat,
            @RequestParam(required = false) Double userLon)
    {
        Optional<Item> itemOpt = itemService.findItemById(id);

        if (itemOpt.isPresent()) {
            Item item = itemOpt.get();


            if (userLat != null && userLon != null) {
                double distance = distanceService.calculateDistance(
                        userLat, userLon,
                        item.getLatitude(), item.getLongitude()
                );

                item.setDistance(distance);
            }
            return ResponseEntity.ok(item);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> getInventoryCheck(){
        long availableItems = itemRepository.countByAvailable(true);
        long totalItems = itemRepository.count();
        long itemRented = (totalItems - availableItems);

        Map<String, Object> results = new HashMap<>();
        results.put("Total items:", totalItems);
        results.put("Available items :", availableItems);
        results.put("Item rented: ", itemRented);

        return ResponseEntity.ok(results);

    }
}
