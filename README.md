# PlaceX - Full-Stack Placement Management Portal

A comprehensive placement management system built with Django REST Framework, React, PostgreSQL, MongoDB, and Kubernetes. Features intelligent resume parsing, job matching, application tracking, and JWT-based authentication.

## 🚀 Features

- **User Authentication**: JWT-based secure authentication with registration, login, and profile management
- **Job Management**: Browse, search, and apply to jobs from various companies
- **Application Tracking**: Real-time status updates for job applications
- **Resume Parsing**: AI-powered resume analysis using MongoDB for unstructured data storage
- **Job Matching**: Intelligent matching between resumes and job requirements
- **Interview Scheduling**: Schedule and manage interviews for applicants
- **Student Profiles**: Comprehensive student profile management with skills, education, and experience
- **Load Balancing**: Nginx-based load balancing for high availability
- **Kubernetes Deployment**: Production-ready Kubernetes configuration

## 📋 Tech Stack

### Backend
- **Django 3.2**: Web framework with REST API support
- **Django REST Framework**: API toolkit with JWT authentication
- **PostgreSQL**: Relational database for structured data
- **MongoDB**: NoSQL database for resume documents and unstructured data
- **Redis**: Message broker for Celery and caching
- **Celery**: Asynchronous task queue for background processing

### Frontend
- **React 18**: UI library with component-based architecture
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client with interceptors for JWT refresh
- **Lucide React**: Icon library

### Infrastructure
- **Kubernetes**: Container orchestration
- **Nginx**: Load balancer and reverse proxy
- **Docker**: Containerization

## 🛠️ Installation

### Prerequisites
- Python 3.8+
- Node.js 18+
- PostgreSQL 15+
- MongoDB 6.0+
- Redis 7.0+
- kubectl (for Kubernetes deployment)

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd PlaceX
```

2. **Create virtual environment and install dependencies**
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

3. **Configure environment variables**
```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=placement_db
export DB_USER=postgres
export DB_PASSWORD=your_password
export MONGO_HOST=localhost
export MONGO_PORT=27017
export MONGO_DB_NAME=sppms
export CELERY_BROKER_URL=redis://localhost:6379/0
export CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

4. **Run migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

5. **Create superuser**
```bash
python manage.py createsuperuser
```

6. **Start Django server**
```bash
python manage.py runserver
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API URL**
Create `.env` file in frontend directory:
```bash
VITE_API_URL=http://localhost:8000/api
```

4. **Start development server**
```bash
npm run dev
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Django Backend**
```bash
cd PlaceX
source .venv/bin/activate
export DB_HOST=localhost DB_PORT=5432 DB_NAME=placement_db DB_USER=postgres DB_PASSWORD=your_password
export MONGO_HOST=localhost MONGO_PORT=27017 MONGO_DB_NAME=sppms
export CELERY_BROKER_URL=redis://localhost:6379/0 CELERY_RESULT_BACKEND=redis://localhost:6379/0
python manage.py runserver
```

**Terminal 2 - React Frontend**
```bash
cd PlaceX/frontend
npm run dev
```

**Terminal 3 - Celery Worker** (optional, for background tasks)
```bash
cd PlaceX
source .venv/bin/activate
export CELERY_BROKER_URL=redis://localhost:6379/0 CELERY_RESULT_BACKEND=redis://localhost:6379/0
celery -A place_x worker -l info
```

Access the application at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api
- Django Admin: http://localhost:8000/admin

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (minikube, kind, or cloud provider)
- kubectl configured
- Container registry access

### Build and Push Images

```bash
# Build Django image
docker build -t your-registry/placex-django:latest .

# Build Frontend image
cd frontend
docker build -t your-registry/placex-frontend:latest .
```

### Deploy to Kubernetes

1. **Apply secrets**
```bash
kubectl apply -f k8s/secrets.yaml
```

2. **Deploy databases**
```bash
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/redis-deployment.yaml
```

3. **Deploy application**
```bash
kubectl apply -f k8s/django-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

4. **Deploy load balancer**
```bash
kubectl apply -f k8s/nginx-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

5. **Check deployment status**
```bash
kubectl get pods
kubectl get services
```

### Access the Application

```bash
# Get the LoadBalancer IP
kubectl get svc nginx-service

# Add to /etc/hosts
<LoadBalancer-IP> placex.local

# Access at http://placex.local
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET /api/auth/profile/` - Get user profile
- `PATCH /api/auth/profile/` - Update user profile
- `POST /api/auth/password/change/` - Change password

### Jobs
- `GET /api/jobs/` - List all jobs
- `GET /api/jobs/:id/` - Get job details
- `POST /api/jobs/:id/apply/` - Apply for a job
- `GET /api/jobs/featured/` - Get featured jobs

### Applications
- `GET /api/applications/` - List user applications
- `GET /api/applications/:id/` - Get application details
- `POST /api/applications/:id/schedule_interview/` - Schedule interview

### Companies
- `GET /api/companies/` - List companies
- `GET /api/companies/:id/` - Get company details

### Student Profiles
- `GET /api/student-profiles/me/` - Get student profile
- `PUT /api/student-profiles/me/` - Update student profile

### Resume Documents (MongoDB)
- `GET /api/resumes/` - List user resumes
- `POST /api/resumes/` - Upload resume
- `GET /api/resumes/:id/` - Get resume details
- `GET /api/resumes/:id/parsing_status/` - Check parsing status

### Job Matches (MongoDB)
- `GET /api/job-matches/` - List job matches
- `POST /api/job-matches/calculate_match/` - Calculate job match

## 🔧 Configuration

### Django Settings
- `place_x/settings.py` - Main Django configuration
- Database connections for PostgreSQL and MongoDB
- JWT token settings
- CORS configuration
- Celery configuration

### Frontend Configuration
- `frontend/src/api/axios.js` - API client with interceptors
- `frontend/src/context/AuthContext.jsx` - Authentication context
- `frontend/tailwind.config.js` - Tailwind CSS configuration

## 📝 Environment Variables

### Backend
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `MONGO_HOST` - MongoDB host
- `MONGO_PORT` - MongoDB port
- `MONGO_DB_NAME` - MongoDB database name
- `CELERY_BROKER_URL` - Redis broker URL
- `CELERY_RESULT_BACKEND` - Redis result backend
- `SECRET_KEY` - Django secret key

### Frontend
- `VITE_API_URL` - Backend API URL

## 🧪 Testing

### Backend Tests
```bash
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📚 Additional Documentation

- **Tech Stack Overview**: See below for detailed technology stack information

---

## Tech Stack Overview

### 1. Backend Architecture

#### Django
- **Purpose**: The primary web framework used to build the backend server.
- **Why it is used**: Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. It provides out-of-the-box features like authentication, routing, and an admin interface, which significantly speeds up development and ensures security best practices.

#### Django REST Framework (DRF)
- **Purpose**: A powerful toolkit for building Web APIs on top of Django.
- **Why it is used**: DRF makes it easy to serialize complex data types (like querysets and model instances) into native Python datatypes that can then be easily rendered into JSON. It provides robust tools for handling authentication, permissions, and request throttling, making our API scalable and secure for the frontend to consume.

#### Celery
- **Purpose**: An asynchronous task queue/job queue.
- **Why it is used**: Offloads heavy, time-consuming background operations (like sending emails, processing large files, or interacting with third-party APIs) from the main request/response cycle. This ensures that the web application remains responsive and user-facing APIs don't block.

### 2. Databases & Storage

#### PostgreSQL
- **Purpose**: The primary relational database management system (RDBMS).
- **Why it is used**: PostgreSQL is highly reliable, robust, and supports advanced data types and performance optimizations. It is the gold standard for Django applications requiring complex queries and transactions with strict data integrity (ACID compliance).

#### MongoDB & Djongo
- **Purpose**: A NoSQL document database, integrated via the Djongo connector.
- **Why it is used**: MongoDB provides flexibility for storing unstructured or semi-structured data that doesn't fit neatly into relational tables. Using Djongo allows the backend to interact with MongoDB using standard Django ORM models, bridging the gap between relational and NoSQL paradigms within the same app.

#### Redis
- **Purpose**: An in-memory data structure store used as a message broker and cache.
- **Why it is used**: Redis acts as the message broker for Celery, routing tasks to workers efficiently. Its extremely fast read/write speeds also make it ideal for caching frequently accessed data or managing temporary state like user sessions.

### 3. Frontend Architecture

#### React
- **Purpose**: The core JavaScript library for building the user interface.
- **Why it is used**: React's component-based architecture allows for building encapsulated components that manage their own state, making complex UIs easier to develop, test, and maintain. Its virtual DOM ensures efficient updates and high performance.

#### Vite
- **Purpose**: The frontend build tool and development server.
- **Why it is used**: Vite provides a significantly faster and leaner development experience compared to traditional bundlers like Webpack. It features instant server start and lightning-fast Hot Module Replacement (HMR), greatly improving developer productivity.

### 4. Infrastructure & DevOps

#### Kubernetes
- **Purpose**: Container orchestration platform.
- **Why it is used**: Kubernetes automates deployment, scaling, and management of containerized applications. It provides self-healing, auto-scaling, and load balancing capabilities, making the application highly available and scalable in production.

#### Nginx
- **Purpose**: Load balancer and reverse proxy.
- **Why it is used**: Nginx distributes incoming traffic across multiple backend instances, ensuring high availability and optimal resource utilization. It also handles SSL termination and serves static content efficiently.

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
