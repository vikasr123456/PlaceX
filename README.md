# PlaceX Tech Stack Overview

This document outlines the technology stack used in the **PlaceX** project. It is intended to provide a clear understanding of the components, their purposes, and the rationale behind their selection for upcoming meetings and architectural discussions.

---

## 1. Backend Architecture

### **Django**
- **Purpose**: The primary web framework used to build the backend server.
- **Why it is used**: Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. It provides out-of-the-box features like authentication, routing, and an admin interface, which significantly speeds up development and ensures security best practices.

### **Django REST Framework (DRF)**
- **Purpose**: A powerful toolkit for building Web APIs on top of Django.
- **Why it is used**: DRF makes it easy to serialize complex data types (like querysets and model instances) into native Python datatypes that can then be easily rendered into JSON. It provides robust tools for handling authentication, permissions, and request throttling, making our API scalable and secure for the frontend to consume.

### **Celery**
- **Purpose**: An asynchronous task queue/job queue.
- **Why it is used**: Offloads heavy, time-consuming background operations (like sending emails, processing large files, or interacting with third-party APIs) from the main request/response cycle. This ensures that the web application remains responsive and user-facing APIs don't block.

---

## 2. Databases & Storage

### **PostgreSQL**
- **Purpose**: The primary relational database management system (RDBMS).
- **Why it is used**: PostgreSQL is highly reliable, robust, and supports advanced data types and performance optimizations. It is the gold standard for Django applications requiring complex queries and transactions with strict data integrity (ACID compliance).

### **MongoDB & Djongo**
- **Purpose**: A NoSQL document database, integrated via the Djongo connector.
- **Why it is used**: MongoDB provides flexibility for storing unstructured or semi-structured data that doesn't fit neatly into relational tables. Using Djongo allows the backend to interact with MongoDB using standard Django ORM models, bridging the gap between relational and NoSQL paradigms within the same app.

### **Redis**
- **Purpose**: An in-memory data structure store used as a message broker and cache.
- **Why it is used**: Redis acts as the message broker for Celery, routing tasks to workers efficiently. Its extremely fast read/write speeds also make it ideal for caching frequently accessed data or managing temporary state like user sessions.

---

## 3. Frontend Architecture

### **React**
- **Purpose**: The core JavaScript library for building the user interface.
- **Why it is used**: React's component-based architecture allows for building encapsulated components that manage their own state, making complex UIs easier to develop, test, and maintain. Its virtual DOM ensures efficient updates and high performance.

### **Vite**
- **Purpose**: The frontend build tool and development server.
- **Why it is used**: Vite provides a significantly faster and leaner development experience compared to traditional bundlers like Webpack. It features instant server start and lightning-fast Hot Module Replacement (HMR), greatly improving developer productivity.

---

## 4. Infrastructure & DevOps

### **Docker & Docker Compose**
- **Purpose**: Containerization platform and multi-container orchestration.
- **Why it is used**: Docker ensures that the application runs seamlessly across different environments (development, staging, production) by packaging the code with its dependencies. Docker Compose allows us to define and run the entire multi-service stack (Django, React, Postgres, Mongo, Redis, Celery) with a single command, making local setup trivial and deployments predictable.
