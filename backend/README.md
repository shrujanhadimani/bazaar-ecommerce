# Bazaar — Backend API

Node.js + Express + MongoDB REST API for the Bazaar ecommerce platform.

---

## Quick Start

```bash
cd bazaar-backend
npm install
cp .env.example .env        # fill in your MONGO_URI and JWT_SECRET
node seed.js                # seed products + default admin
npm run dev                 # starts on http://localhost:5000
```

---

## REST API Reference

### Auth
| Method | Endpoint             | Body                              | Auth | Description           |
|--------|----------------------|-----------------------------------|------|-----------------------|
| POST   | /api/auth/register   | name, email, password, role?      | No   | Register new user     |
| POST   | /api/auth/login      | email, password                   | No   | Login, returns JWT    |

### Products (Public)
| Method | Endpoint             | Query Params                      | Auth | Description           |
|--------|----------------------|-----------------------------------|------|-----------------------|
| GET    | /api/products        | search, category, page, limit     | No   | List all products     |
| GET    | /api/products/:id    | —                                 | No   | Get single product    |

### Cart (Customer)
| Method | Endpoint             | Body                              | Auth     | Description           |
|--------|----------------------|-----------------------------------|----------|-----------------------|
| GET    | /api/cart            | —                                 | Customer | Get user's cart       |
| POST   | /api/cart            | productId, qty                    | Customer | Add item to cart      |
| PUT    | /api/cart/:productId | qty                               | Customer | Update item qty       |
| DELETE | /api/cart/:productId | —                                 | Customer | Remove item from cart |
| DELETE | /api/cart            | —                                 | Customer | Clear entire cart     |

### Orders (Customer)
| Method | Endpoint             | Body                              | Auth     | Description           |
|--------|----------------------|-----------------------------------|----------|-----------------------|
| GET    | /api/orders          | —                                 | Customer | Order history         |
| GET    | /api/orders/:id      | —                                 | Customer | Single order          |
| POST   | /api/orders          | —                                 | Customer | Checkout (cart→order) |

### Admin — Products
| Method | Endpoint                  | Body                              | Auth  | Description        |
|--------|---------------------------|-----------------------------------|-------|--------------------|
| GET    | /api/admin/products       | —                                 | Admin | List all products  |
| POST   | /api/admin/products       | name, price, category, stock, ... | Admin | Create product     |
| PUT    | /api/admin/products/:id   | any product fields                | Admin | Update product     |
| DELETE | /api/admin/products/:id   | —                                 | Admin | Delete product     |

### Admin — Orders
| Method | Endpoint                  | Body       | Auth  | Description        |
|--------|---------------------------|------------|-------|--------------------|
| PUT    | /api/orders/:id/status    | status     | Admin | Update order status|

---

## Authentication

All protected routes need a Bearer token in the header:

```
Authorization: Bearer <token>
```

The token is returned from `/api/auth/login` or `/api/auth/register`.

---

## Data Models

### User
```
name, email, password (hashed), role (customer|admin)
```

### Product
```
name, description, price, category, stock, image, createdBy
```

### Order
```
user, items[{product, name, price, qty}], total, status
```

### Cart
```
user, items[{product, qty}]
```

---

## Default Admin (after seeding)
```
Email:    admin@bazaar.com
Password: admin123
```
