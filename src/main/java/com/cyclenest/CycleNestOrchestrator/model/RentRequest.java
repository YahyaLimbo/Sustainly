package com.cyclenest.CycleNestOrchestrator.model;

import com.azure.spring.data.cosmos.core.mapping.Container;
import com.azure.spring.data.cosmos.core.mapping.PartitionKey;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;

@Container(containerName="request")
public class RentRequest {
    @Id
    @JsonProperty("rent_id")
    private String id;
    
    @PartitionKey
    @JsonProperty("renter_id")
    private String renterId;
     
    @JsonProperty("item_id")
    private String itemId;
    
    @JsonProperty("owner_id")
    private String ownerId;
    
    private String status;
    
    public RentRequest(){}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRenterId() {
        return renterId;
    }

    public void setRenterId(String renterId) {
        this.renterId = renterId;
    }

    public String getItemId() {
        return itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }    
}
