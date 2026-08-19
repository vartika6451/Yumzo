# 🍔 Yumzo - Full-Stack Food Delivery Platform

Welcome to **Yumzo**, a modern, end-to-end food delivery application built to simulate platforms like UberEats or DoorDash. The project features a responsive React frontend, a robust Express backend API, Socket.io for real-time synchronization, MongoDB for persistence, and Stripe for checkout payments.

---

## 📸 Project Screenshots

Here is a visual overview of the key views and dashboards implemented in Yumzo:

| 🏠 Landing Page | 🧑‍💻 Customer Home |
| :---: | :---: |
| ![Landing Page](Yumzo/screenshots/landing.png) | ![Customer Dashboard](Yumzo/screenshots/customer_dashboard.png) |

| 🍣 Interactive Menu | 🏪 Restaurant Kitchen Dashboard |
| :---: | :---: |
| ![Food Menu](Yumzo/screenshots/food_menu.png) | ![Kitchen Dashboard](Yumzo/screenshots/kitchen_dashboard.png) |

| 🚴 Delivery Driver Dashboard |
| :---: |
| ![Driver Dashboard](Yumzo/screenshots/driver_dashboard.png) |

---

## 🛠️ Architecture

This repository is structured as a monorepo:

```text
Food Website/
├── backend/            # Express.js, Socket.io, MongoDB, and Stripe Integration
├── Yumzo/              # React 19 (Vite), Tailwind CSS v4, Zustand, Framer Motion
└── screenshots/        # Application showcase images
```

---

## ⚡ Features

### 🧑‍💻 Customer Journey
- **Video Hero Landing Page**: Modern landing screen with smooth scroll animations.
- **Browse by Cuisine**: Filter menus dynamically (Indian, Chinese, Italian, Japanese).
- **Interactive Cart**: Slide-out cart displaying quantities, subtotal calculations, and item counts.
- **Stripe Checkout**: Redirects to Stripe for secure processing.

### 🏪 Restaurant Kitchen Dashboard
- **Kanban-Style Live tracking**: Column stages for **Accepted**, **Preparing**, and **Ready**.
- **Real-Time Synchronization**: Instantly update orders via Socket.io notifications.

### 🚴 Delivery Driver App
- **Availability State**: Toggle Online/Offline.
- **Available Pickups**: Live queue displaying orders marked as "Ready" from the kitchen.
- **Real-time status updates**: Drivers assign themselves to orders and update status to Out for Delivery / Delivered.

---

## 🚀 Getting Started

Follow these simple steps to run both parts of the application locally.

### Prerequisites
- Node.js (v18+)
- npm
- MongoDB instance (local server or Atlas connection string)

---

### 1. Backend Server Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the Environment Variables:
   Create a `.env` file in the `backend` folder with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```
4. Seed the Database:
   Populate the MongoDB collections with sample restaurants and menus:
   ```bash
   npm run seed
   ```
5. Start the server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000` with WebSocket connections accepted.

---

### 2. Frontend React Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../Yumzo
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the App:
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔄 Live Interactive Testing (Demo Guide)

To easily experience the full-stack flow, Yumzo includes a **Role Switcher** in the main navigation header:

1. **Customer**:
   - Browse the menu, add items (e.g. Sushi, Ramen), and click **Checkout** in the Cart.
2. **Restaurant**:
   - Change your role to **Restaurant** in the dropdown. You will be redirected to `/dashboard/restaurant`.
   - Your order will appear in the **Accepted** column. Click to advance it to **Preparing**, then **Ready**.
3. **Driver**:
   - Change your role to **Driver**. You will be redirected to `/dashboard/driver`.
   - Toggle **Online**. The order will appear under **Available Pickups**. Click to pick it up and transition it to delivered.
