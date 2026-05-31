# E-Commerce Backend REST API

A robust, modular E-Commerce REST API built using **Node.js**, **Express.js**, and **Prisma ORM** with **PostgreSQL**. Designed with clean architecture (MVC), secure token-based authentication, and atomic database transactions.

---

## 🚀 Key Features

- **Secure Authentication & Session Management**:
  - Dual-token system using **Access Tokens** (short-lived JWTs) and **Refresh Tokens** (long-lived JWTs).
  - Stored securely using `httpOnly`, `sameSite: 'strict'` cookies to protect against XSS and CSRF attacks.
  - Password hashing using **bcrypt**.
- **Database Transactions**:
  - Atomic checkout system using Prisma's `$transaction` API.
  - Ensures consistent stock management: checks inventory availability, decrements stock, creates order records, and clears shopping carts in a single atomic transaction.
- **Structured Database Design**:
  - Entity-relation schema managing **Users**, **Products**, **Carts**, **Cart Items**, **Orders**, and **Order Items** with cascade deletion rules.
- **Custom Logging Utility**:
  - A stream-based logger class that writes events asynchronously to a rolling log file while providing color-coded terminal outputs for improved debugging.
- **Standard MVC Architecture**:
  - Clean separation of concerns with Routes, Controllers, Middlewares, Utilities, and Database Configuration files.

---

## 🛠️ Technology Stack

- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules `import/export`)
- **Framework**: [Express.js](https://expressjs.com/) (v5.x)
- **Database ORM**: [Prisma ORM](https://www.prisma.io/) (PostgreSQL)
- **Security & Auth**: JWT (`jsonwebtoken`), `bcrypt`, `cookie-parser`
- **Development Utilities**: `nodemon`, `dotenv`

---

## 📐 Database Schema

The database consists of the following relational models (PostgreSQL):
![Database Schema](./database_schema.png)

---

## 🔌 API Documentation

### Authentication Routes (`/auth`)

| Endpoint         | Method | Description                                                                   | Request Payload                                        | Authentication |
| :--------------- | :----- | :---------------------------------------------------------------------------- | :----------------------------------------------------- | :------------- |
| `/auth/register` | `POST` | Registers a new user, hashes password, returns credentials & sets cookies.    | `{ "name": "...", "email": "...", "password": "..." }` | None           |
| `/auth/login`    | `POST` | Authenticates user credentials, sets access and refresh token cookies.        | `{ "email": "...", "password": "..." }`                | None           |
| `/auth/logout`   | `POST` | Invalidates current refresh token in database and clears client-side cookies. | None                                                   | None           |
| `/auth/refresh`  | `POST` | Verifies client's refresh token and issues a new access token.                | Cookie-based                                           | None           |

### Shopping Cart Routes (`/shopping`)

_All shopping routes require a valid Authorization cookie/header._

| Endpoint         | Method   | Description                                                              | Request Payload                                                   |
| :--------------- | :------- | :----------------------------------------------------------------------- | :---------------------------------------------------------------- |
| `/shopping`      | `GET`    | Retrieves the authenticated user's current shopping cart.                | None                                                              |
| `/shopping`      | `POST`   | Adds a product to the cart (increments quantity if already in the cart). | `{ "id": "product-uuid", "name": "Product Name", "quantity": 1 }` |
| `/shopping/cart` | `PATCH`  | Updates the quantity of a specific item inside the cart.                 | `{ "id": "product-uuid", "newQuantity": 3 }`                      |
| `/shopping/cart` | `DELETE` | Removes a specific item from the shopping cart.                          | `{ "id": "product-uuid" }`                                        |

### Order Routes (`/order`)

_All order routes require a valid Authorization cookie/header._

| Endpoint     | Method   | Description                                                                      | Request Payload             |
| :----------- | :------- | :------------------------------------------------------------------------------- | :-------------------------- |
| `/order`     | `GET`    | Retrieves all orders placed by the logged-in user.                               | None                        |
| `/order/:id` | `GET`    | Retrieves details for a specific order by ID.                                    | None                        |
| `/order`     | `POST`   | **Checkout**: Converts cart items to a confirmed order (atomic stock decrement). | None                        |
| `/order/:id` | `PATCH`  | Updates the status of an order (e.g. `CONFIRMED`, `SHIPPED`, `DELIVERED`).       | `{ "status": "CONFIRMED" }` |
| `/order/:id` | `DELETE` | Deletes/cancels an order.                                                        | None                        |

---

## ⚙️ Installation & Local Setup

### 1. Prerequisites

Ensure you have **Node.js** (v18+) and **PostgreSQL** installed locally or running in the cloud (e.g. Neon PostgreSQL).

### 2. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/Mahmoud-Fathy5/eCommerce-API
cd eCommerce-API
npm install
```

### 3. Environment Variables

Create a `.env` file in the root of the project (use the provided `.env.example` as a template):

```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database?sslmode=require"
ACCESS_TOKEN_SECRET="your_access_token_secret_string"
REFRESH_TOKEN_SECRET="your_refresh_token_secret_string"
NODE_ENV="development"
```

### 4. Database Setup (Migrations & Seed)

Run the Prisma migrations to set up the database tables:

```bash
npx prisma db push
```

Populate the database with default products to enable testing cart and order endpoints:

```bash
node prisma/seed.js
```

### 5. Running the Application

To run the server in development mode with automatic restarts on code changes:

```bash
npm run rundev
```

The server will start running on port `5001`.
