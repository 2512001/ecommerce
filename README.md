# E-Commerce API

A secure and efficient e-commerce backend built with Node.js, Express, and MongoDB, featuring JWT authentication, role-based access control, and comprehensive product and order management.

## 🚀 Features

- **User Authentication**
- JWT-based authentication
- Role-based access control (Admin & Customer)
  - Secure password handling
  - Cookie-based session management

- **Product Management**
  - Create, read, update, and delete products
  - Product categorization
  - Stock management
  - Search and filtering

- **Order Processing**
  - Create and manage orders
  - Order tracking
  - Stock updates
  - Order cancellation

- **Admin Dashboard**
  - Sales analytics
  - User management
  - Product inventory
  - Order monitoring

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT, Cookies
- **Security**: bcryptjs, helmet
- **Validation**: Express Validator

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/2512001/ecommerce.git
cd ecommerce
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
COOKIE_EXPIRE=30
```

4. Start the server:
```bash
npm start
```

## 📚 API Documentation

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | User login |
| `/api/auth/profile` | GET | Get user profile |
| `/api/auth/logout` | POST | User logout |

### Products

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | Get all products |
| `/api/products/:id` | GET | Get single product |
| `/api/products` | POST | Create product (Admin) |
| `/api/products/:id` | PUT | Update product (Admin) |
| `/api/products/:id` | DELETE | Delete product (Admin) |

### Orders

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/orders` | POST | Create order (Customer) |
| `/api/orders` | GET | Get user orders |
| `/api/orders/:id` | GET | Get single order |
| `/api/orders/:id/cancel` | PATCH | Cancel order |

### Admin Dashboard

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/analytics` | GET | Get business metrics |
| `/api/admin/low-stock` | GET | Get low stock products |
| `/api/admin/recent-orders` | GET | Get recent orders |
| `/api/admin/analytics/top-products` | GET | Get top selling products |

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation
- Rate limiting
- CORS protection
- Helmet security headers

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [User Management](#user-management)
  - [Product Management](#product-management)
  - [Order Management](#order-management)
  - [Admin Dashboard](#admin-dashboard)
- [Error Handling](#error-handling)
- [Security](#security)

## Project Overview
This is a comprehensive e-commerce API built with Node.js, Express, and MongoDB. The system implements role-based access control (RBAC) with two main user roles: customers and admins. The API provides endpoints for user authentication, product management, order processing, and administrative functions.

## Features
- User authentication with JWT
- Role-based access control (Customer & Admin)
- Product catalog management
- Order processing system
- Admin dashboard with analytics
- Secure password handling
- Cookie-based authentication
- Comprehensive error handling

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT, Cookies
- **Validation**: Express Validator
- **Security**: bcryptjs, helmet

## Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd <project-directory>
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
COOKIE_EXPIRE=30
```

4. **Start the server**
```bash
npm start
```

## API Endpoints

### Authentication

#### Register New User
```http
POST /api/auth/register
```
Create a new user account. Default role is 'customer'.
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "customer" // Optional, defaults to 'customer'
}
```

#### Login User
```http
POST /api/auth/login
```
Authenticate and get access token.
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

#### Get User Profile
```http
GET /api/auth/profile
```
Get current user's profile information.

#### Logout User
```http
POST /api/auth/logout
```
Clear authentication token and log out.

### User Management

#### Get User Profile
```http
GET /api/users/profile
```

#### Update User Profile
```http
PUT /api/users/profile
```
Request body:
```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

### Product Management

#### Get All Products
```http
GET /api/products
```
Get list of all active products with filtering options:
  - `category`: Filter by category
  - `search`: Search in name and description
  - `sort`: Sort by price (price_asc, price_desc)

#### Get Single Product
```http
GET /api/products/:id
```
Get details of a specific product.

#### Create Product (Admin Only)
```http
POST /api/products
```
Create a new product.
```json
{
    "name": "Product Name",
    "description": "Product Description",
    "price": 99.99,
  "category": "Electronics",
  "stock": 100
}
```

#### Update Product (Admin Only)
```http
PUT /api/products/:id
```
Update product details.

#### Delete Product (Admin Only)
```http
DELETE /api/products/:id
```
Soft delete a product (sets isActive to false).

### Order Management

#### Create Order (Customer Only)
```http
POST /api/orders
```
Create a new order.
```json
{
    "items": [
        {
            "product": "product_id",
            "quantity": 2
        }
    ],
    "shippingAddress": {
    "address": "123 Main St",
        "city": "City",
        "state": "State",
        "zipCode": "12345"
    }
}
```

#### Get User Orders
```http
GET /api/orders
```
Get all orders for current user (customers) or all orders (admins).

#### Get Single Order
```http
GET /api/orders/:id
```
Get details of a specific order.

#### Cancel Order
```http
PATCH /api/orders/:id/cancel
```
Cancel an order and restore product stock.

### Admin Dashboard

#### Get Analytics
```http
GET /api/admin/analytics
```
Get business metrics including:
- Total revenue
- Total orders
- Total customers
- Top selling products
- Monthly sales trends

#### Get Low Stock Products
```http
GET /api/admin/low-stock
```
Get products with stock less than 10 units.

#### Get Recent Orders
```http
GET /api/admin/recent-orders
```
Get latest 10 orders with customer details.

#### Get Top Selling Products
```http
GET /api/admin/analytics/top-products
```
Get detailed analysis of top selling products with options:
- `limit`: Number of products to return (default: 10)
- `timeRange`: Time period (week/month/year/all)

## Error Handling
All endpoints return errors in this format:
```json
{
  "success": false,
  "message": "Error message"
}
```

## Security
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation
- Rate limiting
- CORS protection
- Helmet security headers

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License. 