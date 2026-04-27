# 🛒 Full Stack E-Commerce Application (MERN)

A production-grade **E-Commerce Web Application** built using the **MERN stack**, inspired by platforms like Flipkart and Amazon.

This project demonstrates **end-to-end full stack development**, including authentication, product management, cart system, and order flow.

---

## 🔗 Live Demo

- 🌐 App Link: https://your-frontend-link.vercel.app  


---

## 📂 Repositories

- 🖥️ Frontend Repo: https://github.com/vaibhavkumar18/Ecom.git  
- 🌐 Backend Repo: https://github.com/vaibhavkumar18/Flipkart-be.git  

---

## 📌 Overview

This application allows users to:
- Add/remove items from cart
- Manage user accounts
- Add/edit/delete addresses
- Place orders
- Persist data using backend APIs

Built with focus on **scalable architecture and real-world backend practices**.

---

## ⚙️ Tech Stack

### 🖥️ Frontend
- React.js (Hooks)
- Redux (State Management)
- Tailwind CSS
- React Router

### 🌐 Backend
- Node.js
- Express.js

### 🗄️ Database
- MongoDB (NoSQL)
- Mongoose (ODM)

### 🔐 Authentication
- JWT (JSON Web Tokens)

---

## 🧠 Features

### 👤 Authentication
- User Signup & Login
- JWT-based secure authentication
- Protected routes

### 🛍️ Product System
- Dynamic product listing
- Product detail pages
- Backend-driven data fetching

### 🛒 Cart System
- Add/remove items
- Update quantity
- Persistent cart (stored in DB)

### 📦 Order Flow
- Checkout process
- Order placement logic

### 📍 Address Management
- Add / Edit / Delete address
- Redux-based state handling

---

## 🏗️ Architecture
Frontend (React + Redux)
↓ API Calls
Backend (Node.js + Express)
↓
MongoDB Database


---

## 📁 Project Structure

### Frontend
src/
├── components/
├── pages/
├── redux/
└── App.jsx

---


## 🚀 Getting Started (Local Setup)
### 1. Create a Folder Named "Frontend"
####  Clone Repositories
##### Frontend
```bash
cd Frontend
git clone https://github.com/vaibhavkumar18/Ecom.git
```
### Create a Folder Named "Backend"
##### Backend
```bash
cd Backend
git clone https://github.com/vaibhavkumar18/Flipkart-be.git
```

### 2. Install Dependencies
#### Frontend
```bash
npm install
```

#### Backend
```bash
npm install
```

### 3. Environment Variables (Backend)
#### Create .env file:
```bash
PORT=3000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

### 4. Run Application
#### Frontend
```bash
npm run dev
```

#### Backend
```bash
npm run dev
```
