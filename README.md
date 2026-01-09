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

-   **User Authentication**: Secure Sign Up & Login for Buyers and Sellers.
-   **Role-Based Access**:
    -   **Sellers**: Manage inventory (Add/Edit Products), view Dashboard.
    -   **Buyers**: Browse products, manage Cart, checkout.
-   **Product Management**: CRUD operations for products.
-   **Shopping Cart**: Persistent cart functionality.
-   **Responsive Design**: Mobile-first UI with premium aesthetics.

## 📂 Architecture

The project follows a clean separation of concerns:

```
root/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── context/        # Auth State Management
│   │   ├── pages/          # Application Pages
│   │   ├── services/       # API Services
│   │   └── utils/          # Helpers
│   └── ...
├── controllers/            # Business Logic
├── models/                 # Database Schemas
├── routes/                 # API Endpoints
├── utils/                  # Backend Utilities (Error handling, etc.)
├── middleware.js           # Auth & Validation Middleware
└── app.js                  # Entry Point
```

## 🛠️ Setup & Running

**Prerequisites**: Node.js and MongoDB installed.

1.  **Clone the repository**
2.  **Backend Setup**:
    ```bash
    npm install
    # Create .env file with DB_URL and SESSION_SECRET
    node app.js
    ```
3.  **Frontend Setup**:
    ```bash
    cd client
    npm install
    npm run dev
    ```
4.  **Access**: Open `http://localhost:5173`

## 🛡️ Security Highlights
-   **Input Validation**: ALL inputs validated server-side using Joi.
-   **Error Handling**: Centralized error management prevents info leakage.

---
*Built as a demonstration of robust full-stack engineering.*
