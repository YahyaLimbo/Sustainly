package com.cyclenest.CycleNestOrchestrator.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.client.utils.URIBuilder;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
public class OsrmServiceDistance { 

    private static final String OSRM_API_URL = "http://router.project-osrm.org/route/v1/driving/";
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public OsrmServiceDistance() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(3))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public double calculateDistance(double startLat, double startLon, double endLat, double endLon) {
        try {
            String coordinates = startLon + "," + startLat + ";" + endLon + "," + endLat;
            
            URI uri = new URIBuilder(OSRM_API_URL + coordinates)
                    .addParameter("overview", "false")
                    .build();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(uri)
                    .GET()
                    .timeout(Duration.ofSeconds(5))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                double dist = root.path("routes").get(0).path("distance").asDouble();
                System.out.println("Distance: " + dist + " m");
                return dist;
            } else {
                System.err.println("API Error:" + response.statusCode());
                return 0.0;
            }

        } catch (Exception e) {
            System.err.println("API Fail:" + e.getMessage());
            return 0.0; 
        }
    }
}