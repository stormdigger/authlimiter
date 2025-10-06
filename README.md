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
- [Authentication Flow](#-authentication-flow)
- [Booking Mechanism](#-booking-mechanism)
- [API Usage Examples](#-api-usage-examples)
- [Swagger Documentation](#-swagger-documentation)
- [Testing](#-testing)
- [Security Features](#-security-features)
- [Business Logic](#-business-logic)
- [Error Handling](#-error-handling)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

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

