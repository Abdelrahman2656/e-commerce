# 🛒 Session-Powered E-Commerce RESTful API

> **A robust, production-ready backend for modern e-commerce platforms.**  
> Built with Node.js, Express, and MongoDB, this project showcases advanced features like Stripe payments, Google OAuth, PDF invoice generation, and automated task scheduling.

---

## ⚡ Quick Links
- [🚀 Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📐 Architecture](#-system-architecture)
- [📦 Installation](#-getting-started)
- [📜 API Documentation](#-api-documentation)

---

## 🚀 Key Features

### 🔐 Authentication & Authorization
- **Secure Signup**: Users registration with email verification flow.
- **JWT Authentication**: Token-based access with expiration and secure storage.
- **Social Login**: Integrated **Google OAuth 2.0** for seamless user onboarding.
- **RBAC (Role Based Access Control)**: Granular permissions for `Admin` and `User` roles.
- **Security Check**: Password hashing using `bcrypt` and verification tokens.

### 📦 Module Overviews & Logic

#### 🏷️ Product & Category Management
- **Hierarchical Structure**: Deep categorization with Categories, Subcategories, and Brands.
- **Advanced Search**: Filtering by brand, category, price range, and search terms.
- **Dynamic Pricing**: Automatic calculation of `finalPrice` based on base price and active discounts.
- **Stock Control**: Real-time stock tracking that decreases upon successful orders.
- **Reviews & Ratings**: Feedback system allowing users to rate products and leave detailed reviews.

#### 🛒 Cart & Wishlist
- **Persistent Cart**: Items are saved per user, allowing for a seamless cross-session experience.
- **Smart Checkout**: Validates stock availability and active coupons before proceeding to payment.
- **User Wishlist**: Allowing users to save their favorite items for future purchases.

#### 🎫 Coupon & Discount System
- **Dynamic Coupons**: Admins can create coupons with percentage discounts and expiry dates.
- **Real-time Validation**: Coupons are validated during the checkout process using `Luxon` for time-zone accurate expiry checks.

#### 💳 Orders & Payments
- **Stripe Integration**: Secure credit card processing via Stripe's official API.
- **Payment Options**: Supports both `Cash on Delivery` and `Prepaid (Stripe)` methods.
- **Automated Operations**: 
    - **PDF Invoices**: Professional invoices generated via `PDFKit` and sent to the user upon order placement.
    - **Stock Update**: Automatic inventory deduction on successful transactions.

#### ⚙️ Maintenance & Automation
- **Scheduled Tasks**: Background jobs using `node-schedule` to clean up expired data or handle recurring operations.
- **Media Handling**: Centralized image management via **Cloudinary** for optimized asset delivery.

---

## 🛠️ Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) 
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) 
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) 
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white) 
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=stripe&logoColor=white) 
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) 
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white) 
![Passport.js](https://img.shields.io/badge/Passport-34E27A?style=for-the-badge&logo=passport&logoColor=white)

---

## 📐 System Architecture

The project follows a **Modular MVC Architecture**, ensuring scalability and maintainability.

```text
src/
├── modules/          # Domain-driven modules (Auth, User, Product, Order, etc.)
│   ├── Product/      # Controllers, Routers, and Validation logic for Products
│   ├── Order/        # Payment processing and Invoice triggers
│   └── ...           # (Category, Brand, Coupon, Review, etc.)
├── middleware/       # Custom auth, error handling, and multer file uploads
├── utils/            # Reusable helpers (Email templates, PDF Generation, API Features)
└── database/         # MongoDB connection & Mongoose model definitions
```

---

## 📦 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas or Local Instance
- Cloudinary & Stripe Developer Accounts

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abdelrahman2656/e-commerce.git
   cd e-commerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and populate it with your credentials (see `.env.example` if available).

4. **Run development server**
   ```bash
   npm start # or npm run dev
   ```

---

## 📜 API Documentation

Comprehensive API documentation with request/response examples is available on Postman:

👉 **[View Full API Documentation on Postman](https://documenter.getpostman.com/view/29989813/2sAYJ1mNa6)**

---

## 🤝 Contributing
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👤 Author
**Abdelrahman**  
- [GitHub](https://github.com/Abdelrahman2656)  
- [LinkedIn](https://www.linkedin.com/in/abdelrahman-elmonged-aa89992a3/)

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---
<p align="center">
  Crafted with precision for scalable e-commerce solutions.
</p>
