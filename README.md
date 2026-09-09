# NeuroForge

NeuroForge is an Enterprise Software Development Life Cycle (SDLC) Management Platform designed to manage and streamline the complete software development process in a single platform.

## 🚀 Overview

NeuroForge provides role-based access and APIs for managing different stages of the software development lifecycle, including project management, requirements, sprints, tasks, testing, bugs, documentation, releases, deployments, and reports.

The platform is being developed with a focus on scalability, security, and maintainability.

## 🛠️ Tech Stack

### Backend
- Java
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA / Hibernate
- MySQL
- Maven

### Frontend
- React.js
- JavaScript
- Tailwind CSS
- Axios
- Vite

## 📂 Project Structure

```text
NeuroForge/
│
├── neuroforge-backend/    # Spring Boot backend
│
├── frontend/              # React frontend
│
└── README.md

🔐 Security
JWT-based authentication
Role-based authorization
Spring Security
Password encryption using BCrypt
Protected REST APIs
📌 Main Modules
User & Role Management
Organization Management
Project Management
Requirements Management
Sprint Management
Task Management
Test Case Management
Bug Management
Document Management
Release Management
Deployment Management
Reports
⚙️ Getting Started
Backend

Navigate to the backend:

cd neuroforge-backend

Configure the required environment variables and database connection.

Then run:

mvn spring-boot:run

The backend will start on:

http://localhost:8080
Frontend

Navigate to the frontend:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev
🔑 Environment Variables

Environment variables are required for running the application.

Sensitive configuration such as:

Database credentials
JWT secret
API configuration

should be stored in environment variables and should not be committed to the repository.

Refer to the .env.example files for the required variables.

🚧 Project Status

NeuroForge is currently under active development.

New modules, features, UI improvements, security enhancements, and AI-assisted functionality are being added progressively.

👨‍💻 Development

This project is being developed as a full-stack enterprise application with a Spring Boot REST API backend and React-based frontend.

More detailed documentation, API documentation, architecture diagrams, screenshots, and setup instructions will be added as the project progresses.

📄 License

This project is licensed under the MIT License.
