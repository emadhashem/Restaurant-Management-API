# Pleny - Restaurant Management API

This repository contains the implementation for Part 1 of the Pleny Software and Data Engineer technical assessment. It is a robust RESTful API built with Nest.js, TypeScript, and MongoDB for managing restaurants and user interactions.

## Features
- Restaurant Management:
  - Create new restaurants with multi-language names and geospatial locations.
  - List all restaurants with filtering capabilities (e.g., by cuisine).
  - Retrieve a specific restaurant's details by its ID or unique slug.
  - Find nearby restaurants within a 1KM radius using MongoDB's geospatial queries.
- User Interaction:
  - Create users with favorite cuisines.
  - Allow users to follow/unfollow restaurants.
  - A powerful recommendation engine to suggest restaurants based on the tastes of similar users.

## Tech Stack
- Backend Framework: Nest.js
- Language: TypeScript
- Database: MongoDB with Mongoose
- Containerization: Docker
- API Documentation: Swagger (OpenAPI)

## Running with Docker (Recommended)
This project is fully containerized, allowing you to run the entire application and its database with a single command.

### Prerequisites
- Docker and Docker Compose
  
### Steps 

1. Clone the repository:
```bash
git clone https://github.com/emadhashem/Restaurant-Management-API.git
cd <folder-name>
```

2. Build and Run Containers:
From the root of the project, run the following command. This will build the Nest.js application image and start both the API and MongoDB containers in the background.
```bash
docker-compose up --build -d
```
   - --build: Forces Docker to build the image from the Dockerfile.
   - -d: Runs the containers in detached mode.


## Setup and Installation
- Prerequisites
  - Node.js (v16 or higher recommended)
  - MongoDB instance (local or on Atlas)
  - pnpm (or yarn/npm)
  
- Install dependencies:
```bash
 pnpm install
# or
# yarn install
# npm install
```

- Set up environment variables:
  - Create a .env file in the root directory by copying the example file:
```bash
  cp .env.example .env
  
    - Update the .env file with your MongoDB connection string and other configurations.
    - MONGODB_URI=mongodb://root:examplepassword@localhost:27017/pleny-assessment?authSource=admin
    - PORT=3000
```

- Run the application:
```bash
 pnpm start:dev
# or
# yarn start:dev
# npm run start:dev
```
- The API will be accessible at `http://localhost:3000`.


## API Documentation

Once the application is running, the full API documentation, powered by Swagger, is available at:

http://localhost:3000/api-docs

This interactive UI allows you to explore all endpoints, view their schemas, and test them directly from your browser.

### Architectural Principles

- Modular Design: The application is divided into RestaurantsModule and UsersModule to separate concerns and improve maintainability.

- Clean Code: The code follows Nest.js conventions, with a clear separation between controllers (API layer), services (business logic), and schemas (data layer).

- Reusable Components: DTOs (Data Transfer Objects) are used for validating and shaping incoming data, ensuring they can be reused and maintained easily.

- Configuration Management: The @nestjs/config module is used to manage environment variables, keeping sensitive information like database URLs out of the source code.

- Input Validation: class-validator is used extensively via a global ValidationPipe to ensure all incoming data is valid and secure.
