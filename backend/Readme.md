# Task Management System – Backend

Backend service for the **Task Management System**, built with **Node.js**, **Express**, and **MongoDB**, providing secure APIs for task management, authentication, notifications, and analytics.

## 🚀 Features

- JWT-based authentication with protected API routes
- User registration, login, and profile management
- Task CRUD operations with **status**, **priority**, and **due-date** support
- Advanced filtering, searching, and sorting APIs
- Automated email notifications for task updates and due-date reminders
- Cron jobs for scheduled background tasks
- Real-time overdue task detection logic
- Analytics APIs for task insights and dashboard charts
- Centralized error handling and request validation

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT
- **Email Service:** SMTP / Nodemailer
- **Validation:** Middleware-based validation
- **Security:** Protected routes & environment-based configuration

## 🌐 Deployment

- **Hosting:** Render
- **Database:** MongoDB Atlas
- **Environment Variables:** Managed securely via `.env`

## 📌 API Architecture

- RESTful API design with modular route structure
- Controllers, services, and middleware separation
- Mongoose schemas for scalable data modeling
- User-based data isolation and authorization checks
- Optimized database queries for performance

## ✨ Additional Highlights

- Cron-based background jobs for reminder emails
- Reusable middleware for auth, errors, and validation
- Pagination support for large task lists
- Clean and scalable project folder structure
