
# POPARTS DVG - Premium E-Commerce Website

A full-stack premium e-commerce website for a gifting and custom art brand.

## Project Structure

```
popartsdvg/
├── backend/          # Node.js + Express + MySQL API
├── frontend/         # React + Vite + Tailwind CSS
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- MySQL Server
- npm or yarn

## Setup Instructions

### 1. Database Setup

1. Create a MySQL database named `popartsdvg`
2. Import the database schema from `backend/config/schema.sql`

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with:

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=popartsdvg
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory with:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend dev server:

```bash
npm run dev
```

## Features

### Frontend
- Modern, responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Product catalog with search and filters
- Shopping cart and wishlist
- User authentication (JWT)
- Checkout process with COD and Razorpay
- Order tracking
- Admin dashboard

### Backend
- RESTful API with Express.js
- MySQL database with relational schema
- JWT authentication
- Rate limiting and security with Helmet.js
- Input validation and sanitization
- MVC architecture

### Database Tables
- users
- admins
- products
- product_images
- categories
- orders
- order_items
- cart
- wishlist
- reviews
- coupons
- banners

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Framer Motion
- Axios
- React Router DOM
- React Hot Toast
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MySQL2
- JWT
- Bcrypt.js
- Helmet.js
- Express Rate Limit
- Multer
- Moment.js

## Development

- Backend runs on http://localhost:5000
- Frontend runs on http://localhost:5173
- API base URL: http://localhost:5000/api

## License

MIT
