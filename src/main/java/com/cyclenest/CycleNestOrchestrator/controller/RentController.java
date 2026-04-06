package com.cyclenest.CycleNestOrchestrator.controller;
import com.cyclenest.CycleNestOrchestrator.model.RentRequest;
import com.cyclenest.CycleNestOrchestrator.service.RentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/rent")
public class RentController {
    @Autowired
    private RentService rentService;

    @GetMapping("/user/{renterId}")
    public ResponseEntity<List<RentRequest>> getRequestsByRenter(@PathVariable String renterId) {
        List<RentRequest> requests = rentService.getRequestsByRenter(renterId);
        System.out.println("Found " + requests.size() + " requests for renter: " + renterId);
        return ResponseEntity.ok(requests);
    }
    
   @PostMapping
    public ResponseEntity<RentRequest> createRequest(@RequestBody RentRequest request) {
        RentRequest processedRequest = rentService.createRequest(request);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(processedRequest);
    }
    
    
    //Need to be refactored later for security
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<RentRequest> cancelRequest(@PathVariable String id, @RequestParam String renterId){
        try{
            RentRequest cancelRequest = rentService.cancelRequest(id, renterId);
            return ResponseEntity.ok(cancelRequest);
        }catch(RuntimeException e){
            return  ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
