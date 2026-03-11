package com.cyclenest.CycleNestOrchestrator.service;

import com.cyclenest.CycleNestOrchestrator.model.Item;
import com.cyclenest.CycleNestOrchestrator.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    public Page<Item> findAllItems(Pageable pageable) {
        return itemRepository.findAll(pageable);
    }

    public Optional<Item> findItemById(String id) {
        return itemRepository.findById(id);
    }

    public Page<Item> searchItems(String category, String location, Pageable pageable) {
        boolean hasCategory = category != null && !category.isEmpty();
        boolean hasLocation = location != null && !location.isEmpty();

        if (hasCategory && hasLocation) {
            return itemRepository.findByCategoryIgnoreCaseAndLocationIgnoreCase(category, location, pageable);
        } else if (hasCategory) {
            return itemRepository.findByCategoryIgnoreCase(category, pageable);
        } else if (hasLocation) {
            return itemRepository.findByLocationIgnoreCase(location, pageable);
        }
        return itemRepository.findAll(pageable);
    }
}
