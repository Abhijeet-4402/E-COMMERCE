# ShopEasy - E-Commerce Platform

A production-ready, full-stack E-Commerce application built with the MERN stack (MongoDB, Express, React, Node.js). This project demonstrates modern web development practices, including RESTful API design, MVC architecture, secure authentication, and a responsive UI using Tailwind CSS.

## 🚀 Tech Stack

### Backend
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB (Mongoose ODM)
-   **Authentication**: Passport.js (Session-based with HTTP Context)
-   **Architecture**: MVC (Model-View-Controller)
-   **Security**: RBAC (Role-Based Access Control), Joi Validation, Secure Cookies

### Frontend
-   **Library**: React (Vite)
-   **Styling**: Tailwind CSS
-   **State Management**: React Context API
-   **Routing**: React Router DOM v6
-   **HTTP Client**: Axios with Interceptors

## ✨ Features

-   **User Authentication**: Secure Sign Up & Login for Buyers and Sellers (Passport.js).
-   **Role-Based Access**:
    -   **Sellers**: Manage inventory (Add/Edit Products), view Dashboard, manage customer orders.
    -   **Buyers**: Browse products, add reviews, manage Cart, checkout, track orders.
-   **Product Management**: CRUD operations for products with star ratings and reviews.
-   **Shopping Cart**: Persistent cart with quantity management.
-   **Order Management**: 
    -   Buyers: Place orders with shipping address, view order history, track status.
    -   Sellers: View orders for their products, mark as shipped/delivered.
-   **Payment**: Cash on Delivery (COD) payment method.
-   **Responsive Design**: Mobile-first UI with Tailwind CSS for premium aesthetics.

## 📂 Architecture

The project follows a clean separation of concerns with server and client folders:

```
root/
├── server/                 # Express Backend
│   ├── controllers/        # Business Logic
│   ├── models/             # Database Schemas (Mongoose)
│   ├── routes/             # API Endpoints
│   ├── utils/              # Backend Utilities (Error handling, etc.)
│   ├── middleware.js       # Auth & Validation Middleware
│   ├── app.js              # Express App Setup
│   ├── schema.js           # Joi Validation Schemas
│   ├── seed.js             # Database Seeding Script
│   ├── package.json
│   └── .env                # Environment Variables (NOT in git)
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── context/        # Auth State Management
│   │   ├── pages/          # Application Pages
│   │   ├── services/       # API Services
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## 🛠️ Setup & Running

**Prerequisites**: Node.js v16+ and MongoDB Atlas account (free tier available).

### 1. Clone the Repository
```bash
git clone <repository-url>
cd E-Commerce
```

### 2. Setup MongoDB Atlas (if not already done)
Follow the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) to:
- Create a MongoDB Atlas cluster (free tier)
- Create database user and get connection string
- Set up IP whitelist

### 3. Backend Setup
```bash
cd server
npm install

# Create .env file with your MongoDB Atlas credentials
# DB_URL=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/ecommerce_app?retryWrites=true&w=majority
# SESSION_SECRET=your_secret_key
# FRONTEND_URL=http://localhost:5173
# NODE_ENV=development

node app.js
# Server runs on http://localhost:8080
```

### 4. Frontend Setup
```bash
cd client
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### 5. Access the Application
- **Frontend**: Open `http://localhost:5173`
- **Backend API**: `http://localhost:8080`

## 🧪 Sample Data

To seed the database with sample products:
```bash
cd server
node seed.js
```

## 🛡️ Security Highlights
-   **Input Validation**: ALL inputs validated server-side using Joi.
-   **Error Handling**: Centralized error management prevents info leakage.

---
*Built as a demonstration of robust full-stack engineering.*
