package com.cyclenest.CycleNestOrchestrator.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String QUEUE_NAME = "rental_queue";

    @Bean
    public Queue rentalQueue() {
        return new Queue(QUEUE_NAME, true);
    }
}