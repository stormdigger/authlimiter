# 🎬 Movie Ticket Booking System API

A robust Django REST Framework API for movie ticket booking with JWT authentication, race condition prevention, and comprehensive Swagger documentation.

[![Django](https://img.shields.io/badge/Django-5.2.7-green.svg)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/DRF-3.14.0-red.svg)](https://www.django-rest-framework.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://www.mysql.com/)

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Configuration](#-environment-configuration)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)

---

## ✨ Features

- ✅ **JWT Authentication** - Secure access and refresh tokens
- ✅ **User Management** - Signup and login functionality
- ✅ **Movie & Show Listings** - Browse available movies and showtimes
- ✅ **Seat Booking** - Book specific seats with real-time availability
- ✅ **Booking Management** - View and cancel your bookings
- ✅ **Race Condition Prevention** - Database-level locking for concurrent bookings
- ✅ **Double Booking Protection** - Unique constraints at database level
- ✅ **Overbooking Prevention** - Capacity validation before booking
- ✅ **User Isolation** - Users can only manage their own bookings
- ✅ **Comprehensive Tests** - Unit tests for all critical functionality
- ✅ **Interactive API Docs** - Swagger UI and ReDoc
- ✅ **Admin Panel** - Django admin for data management

---

## 🛠 Tech Stack

### **Backend Framework**
- **Django 5.2.7** - High-level Python web framework
- **Django REST Framework 3.14.0** - Powerful toolkit for building Web APIs

### **Authentication**
- **djangorestframework-simplejwt 5.3.0** - JWT authentication with access & refresh tokens

### **Database**
- **MySQL 8.0+** - Relational database for production
- **mysqlclient 2.2.0** - MySQL connector for Django

### **API Documentation**
- **drf-spectacular 0.27.0** - OpenAPI 3.0 schema generation
- **Swagger UI** - Interactive API documentation
- **ReDoc** - Alternative API documentation

### **Configuration Management**
- **python-decouple 3.8** - Environment variable management

---

## 📂 Project Structure

```
movie_booking_system/
│
├── manage.py                      
├── requirements.txt               
├── .env                          
├── .env.example                  
├── .gitignore                   
├── README.md                  
├── load_sample_data.py           
│
├── movie_booking/               
│   ├── __init__.py
│   ├── settings.py               
│   ├── urls.py                   
│   ├── wsgi.py                   
│   └── asgi.py                   
│
└── booking/                     
    ├── __init__.py
    ├── admin.py                  
    ├── apps.py                   
    ├── models.py                
    ├── serializers.py          
    ├── views.py                 
    ├── urls.py                 
    ├── permissions.py           
    ├── exceptions.py            
    ├── tests.py                 
    └── migrations/               
        └── __init__.py
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.10+** - [Download](https://www.python.org/downloads/)
- **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/)
- **MySQL Workbench** (Optional but recommended) - [Download](https://www.mysql.com/products/workbench/)
- **Git** - [Download](https://git-scm.com/downloads/)
- **pip** - Python package manager (comes with Python)

---

## 🚀 Installation & Setup

### **Step 1: Clone the Repository**

```
git clone https://github.com/stormdigger/MovieBookingApi
```


### **Step 2: Create Virtual Environment**

**Windows:**

```
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux:**

```
python3 -m venv venv
source venv/bin/activate
```


You should see `(venv)` in your terminal prompt.

### **Step 3: Install Dependencies**

```
pip install -r requirements.txt
```


---

## 🔐 Environment Configuration

### **Step 1: Generate Django SECRET_KEY**

Run this command to generate a secure secret key:

```
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```


Copy the output (e.g., `django-insecure-k$8h2@m5n!p9q#r6s...`)

### **Step 2: Create .env File**

Create a `.env` file in the project root directory:


### **Step 3: Configure Environment Variables**

Open `.env` and add the following (replace with your actual values):

```
SECRET_KEY=your-generated-secret-key-paste-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

MySQL Database Configuration
DB_ENGINE=django.db.backends.mysql
DB_NAME=movie_booking_db
DB_USER=root
DB_PASSWORD=your_mysql_root_password
DB_HOST=localhost
DB_PORT=3306

JWT Token Settings
ACCESS_TOKEN_LIFETIME_HOURS=1
REFRESH_TOKEN_LIFETIME_DAYS=7
```

---

## 🗄 Database Setup

### **Step 1: Open MySQL Workbench**

1. Launch MySQL Workbench
2. Connect to your local MySQL server
3. Enter your root password

### **Step 2: Create Database**

Run this SQL command in MySQL Workbench:

```
CREATE DATABASE movie_booking_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
### **Step 4: Verify Django Connection (In Terminal)**
```
python manage.py check
```

### **Step 5: Create Database Tables**

```
python manage.py makemigrations
python manage.py migrate
```

---

## 🎯 Running the Application

### **Step 1: Create Superuser (Admin Access)**

```
python manage.py createsuperuser
```

Follow the prompts:
```
Username: admin
Email address: admin@example.com
Password: ****
Password (again): ****
Superuser created successfully.
```

### **Step 2: Load Sample Data**

```
python load_sample_data.py
```
### **Step 3: Start Development Server**
```
python manage.py runserver
```

### **Step 4: Access the Application**

Open your browser and visit:

- **Swagger UI:** http://127.0.0.1:8000/swagger/
- **ReDoc:** http://127.0.0.1:8000/redoc/
- **Admin Panel:** http://127.0.0.1:8000/admin/

**Note:** The root URL `http://127.0.0.1:8000/` returns 404 by design (API-only backend).

---

## 🧪 Testing Your API

### **Option 1: Using Swagger UI (Recommended)**

Open Swagger UI:

[http://127.0.0.1:8000/swagger/](http://127.0.0.1:8000/swagger/)

**Test Signup (Create a user):**
1. Click on **POST /api/signup/**
2. Click **"Try it out"**
3. Enter JSON:
```
{
  "username": "User1",
  "email": "user1@example.com",
  "password": "****",
  "password2": "****"
}
```

4. Click **"Execute"**

**Test Login (Get JWT Token):**
1. Click on **POST /api/login/**
2. Click **"Try it out"**
3. Enter JSON:
```
{
  "username": "User1",
  "password": "****"
}
```

4. Click **"Execute"**
5. Copy the **access** token from the response

**Authorize in Swagger (Add JWT Token):**
1. Click the **"Authorize"** button at the top (🔒 icon)
2. Enter: `<your_access_token>`
   - Example: `eyJ0eXAiOiJKV1QiLCJhbGc...`
3. Click **"Authorize"**
4. Click **"Close"**

**Test Protected Endpoints:**
Now all API calls will include your JWT token!

- **GET /api/movies/** - List all movies
- **GET /api/movies/1/shows/** - List shows for movie #1
- **POST /api/shows/1/book/** - Book a seat:
```
{
  "seat_number": 1
}
```

- **GET /api/my-bookings/** - View your bookings
- **POST /api/bookings/1/cancel/** - Cancel booking #1

### **Option 2: Using cURL (Command Line)**

```
1. Signup
curl -X POST http://127.0.0.1:8000/api/signup/
-H "Content-Type: application/json"
-d "{\"username\":\"john\",\"email\":\"john@example.com\",\"password\":\"johnpass123\",\"password2\":\"johnpass123\"}"

2. Login (save the access token)
curl -X POST http://127.0.0.1:8000/api/login/
-H "Content-Type: application/json"
-d "{\"username\":\"john\",\"password\":\"johnpass123\"}"

3. List movies (replace <token> with your access token)
curl -X GET http://127.0.0.1:8000/api/movies/
-H "Authorization: <your_access_token>"

4. Book a seat
curl -X POST http://127.0.0.1:8000/api/shows/1/book/
-H "Authorization: Bearer <your_access_token>"
-H "Content-Type: application/json"
-d "{\"seat_number\":15}"
```
---
## 📡 API Endpoints

### **Authentication Endpoints**

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/signup/` | Register a new user | ❌ Public |
| POST | `/api/login/` | Login and get JWT tokens | ❌ Public |
| POST | `/api/token/refresh/` | Refresh access token | ❌ Public |

### **Movie & Show Endpoints**

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/api/movies/` | List all movies | ✅ Required |
| GET | `/api/movies/{movie_id}/shows/` | List shows for a movie | ✅ Required |

### **Booking Endpoints**

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/shows/{show_id}/book/` | Book a seat for a show | ✅ Required |
| POST | `/api/bookings/{booking_id}/cancel/` | Cancel a booking | ✅ Required |
| GET | `/api/my-bookings/` | List user's bookings | ✅ Required |

### **Documentation Endpoints**

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/swagger/` | Swagger UI documentation | ❌ Public |
| GET | `/redoc/` | ReDoc documentation | ❌ Public |
| GET | `/api/schema/` | OpenAPI 3.0 schema (JSON) | ❌ Public |







