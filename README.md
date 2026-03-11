# CycleNest Orchestrator Service

## Overview

CycleNest is a RESTful application designed to manage item rentals. The system is integrated with an external API (OSRM), asynchronous messaging (RabbitMQ), and NOSQL cloud-based databases (Cosmos DB).The application is deployed on a cloud Infrastructure-as-a-Service (IaaS) environment using Microsoft Azure Virtual machine, that serves Tomcat Server.

- **Public IP:** 5151.103.249.205
- **Base URL:** `http://5151.103.249.205:8080/CycleNest`

**Technology used

- **OS** Ubuntu 22.04 LTS
- **Region** North Switzerland
- **Environment** Java 17 and Spring Boot 2.7.9 compatibile with Tomcat 9
- **Web Server** Apache Tomcat 9
- **Message Broker** RabbitMQ

## Configuration Instructions

Create a Virtual Machine:

- **Image:** Ubuntu 22.04 LTS
- **Size:** Standard_B1
- Navigate to the **Network Security Group (NSG)** associated with your VM.
- Add **Inbound Security Rules** to allow traffic on:
    - Port `22` (SSH)
    - Port `8080` (HTTP/Tomcat)

Environment setup:

- SSH into the Azure VM

`sudo apt-get update`

Install Java 17 and Maven:

`sudo apt install openjdk-17-jdk maven -y`

Install Tomcat 9:

`sudo apt install tomcat9 tomcat9-admin -y`

Install and start RabbitMQ:

`sudo apt-get install rabbitmq-server -y
sudo systemctl enable rabbitmq-server
sudo systemctl start rabbitmq-server`

Clone the repository:

`git clone https://olympus.ntu.ac.uk/N1140313/CycleNestOrchestrator.git`

`cd CycleNestOrchestrator`

Build the application with: 

`./mvnw clean install` 

It will generate a .war file, it will be needed to be uploaded inside Tomcat Manager.


Security was implemented and configuring Azure Network Security Groups (NSG) following the Principle of Least Privilege.
* Ingress Rules (Inbound Traffic):
    * **Port 8080 (TCP):** `ALLOW Any` - Open to the public to allow access to REST endpoints.
    * **Port 22 (SSH):** `RESTRICTED` - Only allowed from Admin IP to prevent unauthorized root access.
