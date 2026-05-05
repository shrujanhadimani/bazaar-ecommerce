# 🛒 Bazaar — Full Stack Ecommerce Platform

A full-stack ecommerce platform where sellers can manage products and customers can browse, add to cart, and purchase — built with React, Node.js, Express, and MongoDB.

---

## 📸 Features

| Role | Features |
|---|---|
| 👤 Customer | Browse products, search & filter, add to cart, adjust quantity, checkout, view order history |
| 🛠 Admin | Dashboard with stats, create / edit / delete products, manage order statuses |

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Auth | JWT (JSON Web Tokens) |
| Password | bcryptjs |

---

## 📁 Project Structure

```
bazaar-ecommerce/
├── bazaar/                  ← React Frontend
│   └── src/
│       └── App.jsx          ← Full UI (Auth, Catalog, Cart, Orders, Admin)
│
└── bazaar-backend/          ← Node.js Backend
    ├── models/
    │   ├── User.js          ← User schema (name, email, password, role)
    │   ├── Product.js       ← Product schema (name, price, category, stock)
    │   ├── Order.js         ← Order schema (items snapshot, total, status)
    │   └── Cart.js          ← Cart schema (user, items)
    ├── routes/
    │   ├── auth.js          ← Register & Login
    │   ├── products.js      ← Public product listing
    │   ├── cart.js          ← Cart CRUD
    │   ├── orders.js        ← Checkout & order history
    │   └── adminProducts.js ← Admin product CRUD
    ├── middleware/
    │   └── auth.js          ← JWT protect + adminOnly guard
    ├── seed.js              ← Seed database with sample data
    └── server.js            ← Express entry point
```

---

## 🔌 REST API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT token |

### Products (Public)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Fetch all products (search, filter, paginate) |
| GET | `/api/products/:id` | Fetch single product |

### Cart (Customer)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:productId` | Update item quantity |
| DELETE | `/api/cart/:productId` | Remove item from cart |
| DELETE | `/api/cart` | Clear entire cart |

### Orders (Customer)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders` | Get order history |
| POST | `/api/orders` | Checkout — converts cart to order |

### Admin (Admin only)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/products` | List all products |
| POST | `/api/admin/products` | Create new product |
| PUT | `/api/admin/products/:id` | Update product |
| DELETE | `/api/admin/products/:id` | Delete product |
| PUT | `/api/orders/:id/status` | Update order status |

---

## ⚙️ Setup — Backend

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/bazaar-backend.git
cd bazaar-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create environment file
```bash
copy .env.example .env
```

Fill in your values in `.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bazaar?retryWrites=true
JWT_SECRET=your_long_secret_key_here
NODE_ENV=development
```

### 4. Seed the database
```bash
node seed.js
```

Output:
```
✅ Connected to MongoDB
✅ Admin created — admin@bazaar.com / admin123
✅ 8 products seeded
```

### 5. Start the server
```bash
npm run dev
```

Server runs at → `http://localhost:5000`

---

## ⚙️ Setup — Frontend

### 1. Navigate to frontend folder
```bash
cd bazaar
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the app
```bash
npm run dev
```

App runs at → `http://localhost:5173`

---

## 🔐 Authentication

All protected routes require a Bearer token in the request header:

```
Authorization: Bearer <your_jwt_token>
```

The token is returned from `/api/auth/login` or `/api/auth/register`.

---

## 🧪 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@bazaar.com | admin123 |
| Customer | register any email | any password |

---

## 📦 Data Models

### User
```
name, email, password (bcrypt hashed), role (customer | admin)
```

### Product
```
name, description, price, category, stock, image, createdBy
```

### Order
```
user, items[{ product, name, price, qty }], total, status
```

### Cart
```
user, items[{ product, qty }]
```

---

## 🚀 Deployment

| Service | Purpose |
|---|---|
| Vercel | Frontend (React) |
| Railway / Render | Backend (Node.js) |
| MongoDB Atlas | Database (free tier) |

---

## 👨‍💻 Author

**Shrujan** — Data Engineer & Full Stack Developer

---

## 📄 License

MIT License — free to use and modify.
