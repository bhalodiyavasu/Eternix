# 🛒 Eternix — E-commerce Project Setup Guide

> **Project Name:** Eternix  
> **Type:** Full-Stack E-commerce Web Application  
> **Tech Stack:** React (Vite) + Node.js (Express) + MongoDB  
> **Created by:** Vasu Bhalodiya

---

## 📋 Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Project Overview](#2-project-overview)
3. [Project Folder Structure](#3-project-folder-structure)
4. [Third-Party Services Required](#4-third-party-services-required)
5. [Step-by-Step Setup](#5-step-by-step-setup)
6. [Environment Variables — Backend](#6-environment-variables--backend)
7. [Environment Variables — Frontend](#7-environment-variables--frontend)
8. [Running the Project](#8-running-the-project)
9. [API Routes Reference](#9-api-routes-reference)
10. [Database Models](#10-database-models)
11. [Stripe Webhook Setup (Local)](#11-stripe-webhook-setup-local)
12. [Deployment Notes](#12-deployment-notes)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Prerequisites

Make sure you have these installed on your system before starting:

| Tool         | Version  | Download Link                         |
|--------------|----------|---------------------------------------|
| **Node.js**  | v22.x+   | https://nodejs.org                    |
| **npm**      | v10.x+   | Comes with Node.js                    |
| **Git**      | Latest   | https://git-scm.com                   |
| **Stripe CLI** | Latest | https://stripe.com/docs/stripe-cli    |

> [!IMPORTANT]
> Verify installations by running:
> ```bash
> node -v    # Should show v22.x.x
> npm -v     # Should show 10.x.x
> git --version
> ```

---

## 2. Project Overview

**Eternix** is a full-stack e-commerce platform for fashion (T-shirts, Shirts, Jackets, Shoes) with these features:

### Key Features:
- 🔐 **Google Authentication** (Firebase Auth)
- 🛍️ **Product Catalog** with category/gender filters
- 🛒 **Shopping Cart** (guest + logged-in user support)
- 💳 **Stripe Payment Gateway** (Checkout Sessions)
- 📦 **Order Management** with status tracking
- 🧾 **PDF Receipt Generation** (Puppeteer)
- 📧 **Email Notifications** (Welcome email + Order receipt via Resend)
- 👤 **User Profile** management
- 🔧 **Admin Panel** for product management (CRUD + Cloudinary image upload)

### Architecture:
```
┌─────────────────────┐     API Calls      ┌─────────────────────┐
│                     │ ──────────────────► │                     │
│   FRONTEND (React)  │                     │  BACKEND (Express)  │
│   Port: 5173        │ ◄────────────────── │  Port: 5000         │
│                     │     JSON + Cookies  │                     │
└─────────────────────┘                     └──────────┬──────────┘
                                                       │
                                            ┌──────────▼──────────┐
                                            │   MongoDB Atlas     │
                                            │   (Database)        │
                                            └─────────────────────┘
```

---

## 3. Project Folder Structure

```
Ecommerce With Backend/
├── frontend/                          # React (Vite) Frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/                    # Static images/icons
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── Button/
│   │   │       ├── Drawer/
│   │   │       ├── Footer/
│   │   │       ├── Form/
│   │   │       ├── Header/
│   │   │       ├── Loader/
│   │   │       ├── Modal/
│   │   │       ├── PixelArtCanvas/
│   │   │       └── ProductQuickView/
│   │   ├── config/
│   │   │   └── firebase.js            # Firebase client config
│   │   ├── contexts/
│   │   │   ├── ToastContext.jsx        # Global toast notifications
│   │   │   └── Toast.css
│   │   ├── data/
│   │   │   └── mockData.js            # Static UI data
│   │   ├── pages/
│   │   │   ├── Admin/                 # Admin panel + login
│   │   │   ├── Auth/                  # Google Auth page
│   │   │   ├── Cart/                  # Cart sidebar
│   │   │   ├── CartPage/              # Full cart page
│   │   │   ├── Checkout/              # Checkout flow
│   │   │   ├── Collections/           # Product listing + filters
│   │   │   ├── DownloadReceipt/       # PDF receipt download
│   │   │   ├── Home/                  # Landing page
│   │   │   ├── NotFound/              # 404 page
│   │   │   ├── PaymentRecipt/         # Payment success page
│   │   │   └── Profile/               # User profile
│   │   ├── store/
│   │   │   ├── actions/               # RTK Query API slices
│   │   │   │   ├── authActions.js
│   │   │   │   ├── cartActions.js
│   │   │   │   ├── paymentActions.js
│   │   │   │   ├── productActions.js
│   │   │   │   └── userActions.js
│   │   │   ├── reducers/
│   │   │   │   └── authReducer.js
│   │   │   └── index.js               # Redux store configuration
│   │   ├── utils/
│   │   │   ├── AppRouter.jsx           # React Router + route guards
│   │   │   ├── formatebook.js          # Format utilities
│   │   │   └── guestCart.js            # Guest cart (localStorage)
│   │   ├── App.jsx                     # Root component
│   │   ├── main.jsx                    # Entry point
│   │   └── index.css                   # Global styles
│   ├── .env.example                    # 👈 Frontend env template
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json                     # Vercel SPA rewrites
│   ├── eslint.config.js
│   └── package.json
│
├── backend/                            # Node.js (Express) Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                   # MongoDB connection
│   │   │   ├── cloudinary.js           # Cloudinary config
│   │   │   └── firebaseAdmin.js        # Firebase Admin SDK
│   │   ├── controllers/
│   │   │   ├── authController.js       # Google Auth + JWT
│   │   │   ├── cartController.js       # Cart CRUD
│   │   │   ├── orderController.js      # Order management + PDF
│   │   │   ├── paymentController.js    # Stripe checkout + webhook
│   │   │   ├── productController.js    # Product CRUD
│   │   │   └── userController.js       # User profile
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js       # JWT verification
│   │   │   └── multer.js              # File upload handling
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Cart.js
│   │   │   └── Order.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   ├── paymentRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── templates/
│   │   │   ├── welcomeTemplate.js      # Welcome email HTML
│   │   │   ├── receiptEmailTemplate.js # Receipt email HTML
│   │   │   └── receiptTemplate.js      # PDF receipt template
│   │   ├── utils/
│   │   │   ├── emailService.js         # Resend email sender
│   │   │   └── generateToken.js        # JWT token generator
│   │   └── validations/               # (Empty — for future Zod schemas)
│   ├── .env.example                    # 👈 Backend env template
│   ├── app.js                          # Express app config + CORS
│   ├── server.js                       # Server entry point
│   └── package.json
│
└── .git/                               # Git repository
```

---

## 4. Third-Party Services Required

You need accounts on the following services. **All are free-tier compatible** for development.

### 4.1 MongoDB Atlas (Database)
- **Website:** https://cloud.mongodb.com
- **What to do:**
  1. Create a free account
  2. Create a new Cluster (free M0 tier is enough)
  3. Create a database user (username + password)
  4. Whitelist your IP (or use `0.0.0.0/0` for development)
  5. Click "Connect" → "Connect your application" → Copy the connection string
  6. Replace `<password>` with your database user's password
- **Provides:** `MONGO_URI`

### 4.2 Firebase (Google Authentication)
- **Website:** https://console.firebase.google.com
- **What to do:**
  1. Create a new Firebase project
  2. Go to **Authentication** → **Sign-in method** → Enable **Google**
  3. Go to **Project Settings** → **General** → Add a **Web App**
  4. Copy the `apiKey`, `authDomain`, and `projectId` from the config
  5. Go to **Project Settings** → **Service Accounts** → Click **"Generate new private key"**
  6. Open the downloaded JSON file and copy:
     - `project_id` → `FIREBASE_PROJECT_ID`
     - `private_key` → `FIREBASE_PRIVATE_KEY`
     - `client_email` → `FIREBASE_CLIENT_EMAIL`
- **Provides (Frontend):** `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`
- **Provides (Backend):** `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`

### 4.3 Cloudinary (Image Uploads)
- **Website:** https://cloudinary.com
- **What to do:**
  1. Create a free account
  2. Go to Dashboard → Copy the Cloud Name, API Key, and API Secret
- **Provides:** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### 4.4 Stripe (Payment Gateway)
- **Website:** https://stripe.com
- **What to do:**
  1. Create an account
  2. Go to **Developers** → **API Keys** (use Test mode keys for development)
  3. Copy the **Secret Key** (starts with `sk_xxxx_...`)
  4. For the webhook secret, see [Section 11](#11-stripe-webhook-setup-local)
- **Provides:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

### 4.5 Resend (Email Service)
- **Website:** https://resend.com
- **What to do:**
  1. Create a free account
  2. Go to **API Keys** → Create a new API key
  3. Add & verify your sending domain (or use their `onboarding@resend.dev` for testing)
- **Provides:** `RESEND_API_KEY`, `RESEND_SENDER_EMAIL`

---

## 5. Step-by-Step Setup

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd "Ecommerce With Backend"
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

This installs these key packages:

| Package              | Purpose                           |
|----------------------|-----------------------------------|
| `express`            | Web framework                     |
| `mongoose`           | MongoDB ODM                       |
| `cors`               | Cross-Origin Resource Sharing     |
| `cookie-parser`      | Parse cookies from requests       |
| `dotenv`             | Load environment variables        |
| `jsonwebtoken`       | JWT authentication                |
| `bcryptjs`           | Password hashing                  |
| `firebase-admin`     | Verify Google Auth tokens         |
| `cloudinary`         | Image upload & management         |
| `multer`             | File upload middleware            |
| `stripe`             | Payment processing                |
| `resend`             | Email sending service             |
| `puppeteer-core`     | PDF receipt generation            |
| `@sparticuz/chromium` | Chromium binary for Puppeteer    |
| `nodemailer`         | Alternative email transport       |
| `nodemon` (dev)      | Auto-restart server on changes    |

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

This installs these key packages:

| Package                   | Purpose                          |
|---------------------------|----------------------------------|
| `react` + `react-dom`    | UI library                        |
| `react-router-dom`       | Client-side routing               |
| `@reduxjs/toolkit`       | State management (RTK Query)      |
| `react-redux`            | React-Redux bindings              |
| `firebase`               | Firebase client SDK (Google Auth) |
| `@stripe/stripe-js`      | Stripe frontend SDK               |
| `@stripe/react-stripe-js`| Stripe React components           |
| `lucide-react`           | Icon library                      |
| `vite` (dev)             | Build tool & dev server            |
| `@vitejs/plugin-react`   | React plugin for Vite              |

### Step 4: Create Environment Files

> [!CAUTION]
> Never commit `.env` files to Git! They contain sensitive API keys and secrets.

#### Backend `.env` file:
```bash
cd backend
cp .env.example .env
# Now edit .env with your actual values (see Section 6)
```

#### Frontend `.env` file:
```bash
cd frontend
cp .env.example .env
# Now edit .env with your actual values (see Section 7)
```

---

## 6. Environment Variables — Backend

Create a file `backend/.env` with these values:

```env
# Server Port
PORT=5000

# MongoDB Atlas Connection String
# 👉 Get from: MongoDB Atlas > Connect > Connect your application
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database-name>?appName=<app-name>

# JWT Secret (any random strong string)
# 👉 Generate with: openssl rand -base64 32
JWT_SECRET=your_random_secret_key_here

# Cloudinary (Image Uploads)
# 👉 Get from: Cloudinary Dashboard
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe (Payments)
# 👉 Get from: Stripe Dashboard > Developers > API Keys (use TEST keys)
STRIPE_SECRET_KEY=sk_xxxx_xxxxxxxxxxxxxxxxxxxxxxxx
# 👉 Get from: Stripe CLI when running `stripe listen` locally (see Section 11)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxx

# Resend (Email Service)
# 👉 Get from: Resend Dashboard > API Keys
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
# 👉 Your verified sender email in Resend
RESEND_SENDER_EMAIL=your-email@yourdomain.com

# Frontend URL (for CORS configuration)
FRONTEND_URL=http://localhost:5173

# Firebase Admin SDK (Google Auth token verification)
# 👉 Get from: Firebase Console > Project Settings > Service Accounts > Generate new private key
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
# ⚠️ Copy the ENTIRE private key including BEGIN/END markers
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_CONTENT_HERE\n-----END PRIVATE KEY-----\n"
```

> [!WARNING]
> The `FIREBASE_PRIVATE_KEY` must be wrapped in double quotes `"..."` and newlines must be represented as `\n` (literal backslash-n). Copy it exactly from the downloaded JSON service account file.

---

## 7. Environment Variables — Frontend

Create a file `frontend/.env` with these values:

```env
# Backend API URL
# 👉 For local development, use:
VITE_API_URL=http://localhost:5000/api

# Admin Login Credentials (for admin panel access)
# 👉 Set to whatever admin email/password you want
VITE_ADMIN_EMAIL=admin@gmail.com
VITE_ADMIN_PASSWORD=admin1234

# Firebase (Google Auth)
# 👉 Get from: Firebase Console > Project Settings > General > Your Web App > SDK config
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
```

> [!NOTE]
> All frontend env variables MUST start with `VITE_` prefix. This is a Vite requirement — variables without this prefix won't be accessible in the browser.

---

## 8. Running the Project

### Start Backend Server:
```bash
cd backend
npm run dev
```
- Runs on: `http://localhost:5000`
- Uses `nodemon` for auto-restart on file changes
- You should see: `Server is running on port 5000` and `MongoDB Connected: ...`

### Start Frontend Dev Server:
```bash
cd frontend
npm run dev
```
- Runs on: `http://localhost:5173`
- Uses Vite with Hot Module Replacement (HMR)

### Build Frontend for Production:
```bash
cd frontend
npm run build    # Creates optimized build in /dist folder
npm run preview  # Preview production build locally
```

> [!TIP]
> Open **two separate terminal windows/tabs** — one for backend, one for frontend. Both need to be running simultaneously.

---

## 9. API Routes Reference

All backend routes are prefixed with `/api`:

### Auth Routes (`/api/auth`)
| Method | Endpoint    | Auth | Description                   |
|--------|-------------|------|-------------------------------|
| POST   | `/google`   | No   | Login/Register via Google     |
| POST   | `/logout`   | No   | Logout (clear cookie)         |

### User Routes (`/api/users`)
| Method | Endpoint    | Auth | Description                   |
|--------|-------------|------|-------------------------------|
| GET    | `/profile`  | Yes  | Get logged-in user profile    |
| PATCH  | `/profile`  | Yes  | Update user profile           |

### Product Routes (`/api/products`)
| Method | Endpoint    | Auth | Description                   |
|--------|-------------|------|-------------------------------|
| GET    | `/`         | No   | Get all products (with filters) |
| GET    | `/:id`      | No   | Get single product by ID      |
| POST   | `/`         | Yes  | Create product (Admin)        |
| PATCH  | `/:id`      | Yes  | Update product (Admin)        |
| DELETE | `/:id`      | Yes  | Delete product (Admin)        |

### Cart Routes (`/api/cart`)
| Method | Endpoint    | Auth | Description                   |
|--------|-------------|------|-------------------------------|
| POST   | `/`         | Yes  | Add item to cart              |
| GET    | `/`         | Yes  | Get user's cart                |
| PATCH  | `/`         | Yes  | Update cart item quantity      |
| DELETE | `/`         | Yes  | Remove item from cart          |

### Order Routes (`/api/orders`)
| Method | Endpoint                        | Auth | Description                   |
|--------|---------------------------------|------|-------------------------------|
| GET    | `/my-orders`                    | Yes  | Get logged-in user's orders   |
| GET    | `/:orderId/receipt`             | Yes  | Download PDF receipt           |
| GET    | `/receipt-by-session/:sessionId`| No   | Download receipt by Stripe session |

### Payment Routes (`/api/payment`)
| Method | Endpoint                      | Auth | Description                   |
|--------|-------------------------------|------|-------------------------------|
| POST   | `/create-checkout-session`    | Yes  | Create Stripe checkout session |
| POST   | `/webhook`                    | No   | Stripe webhook handler         |
| GET    | `/verify-session/:sessionId`  | No   | Verify Stripe session status   |

---

## 10. Database Models

### User Model
| Field            | Type   | Required | Notes                       |
|------------------|--------|----------|-----------------------------|
| username         | String | Yes      |                             |
| email            | String | Yes      | Unique                      |
| googleId         | String | No       | Unique, sparse              |
| avatar           | String | No       | Profile picture URL         |
| phone            | String | No       |                             |
| shippingAddress  | Object | No       | address, country, state, city, postalCode |

### Product Model
| Field       | Type     | Required | Notes                            |
|-------------|----------|----------|----------------------------------|
| name        | String   | Yes      |                                  |
| price       | Number   | Yes      |                                  |
| category    | String   | Yes      | Enum: tshirt, shirt, jacket, shoes |
| gender      | String   | Yes      | Enum: man, woman, kids           |
| status      | String   | No       | Enum: "New In", "Best Seller"    |
| description | String   | Yes      |                                  |
| sizes       | [String] | Yes      |                                  |
| colors      | [Object] | No       | Array of { name, hex }           |
| image       | String   | Yes      | Cloudinary URL                   |

### Cart Model
| Field     | Type     | Required | Notes                       |
|-----------|----------|----------|-----------------------------|
| user      | ObjectId | Yes      | References User              |
| items     | [Object] | Yes      | Array of { product, quantity, size, color } |

### Order Model
| Field            | Type     | Required | Notes                            |
|------------------|----------|----------|----------------------------------|
| user             | ObjectId | Yes      | References User                  |
| items            | [Object] | Yes      | Array of { product, quantity, size, color } |
| contactInfo      | Object   | Yes      | fullName, phone, email           |
| shippingInfo     | Object   | Yes      | country, state, city, postalCode, address |
| subtotal         | Number   | Yes      |                                  |
| shippingCharge   | Number   | No       | Default: 0                       |
| totalAmount      | Number   | Yes      |                                  |
| status           | String   | No       | Enum: Pending, Processing, Shipped, Delivered, Cancelled |
| paymentStatus    | String   | No       | Enum: Unpaid, Paid               |
| stripeSessionId  | String   | No       |                                  |
| orderNumber      | String   | No       | Unique                           |
| paymentId        | String   | No       |                                  |

---

## 11. Stripe Webhook Setup (Local)

For payments to work locally, you need to forward Stripe webhooks to your local server:

### Step 1: Install Stripe CLI
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows (Scoop)
scoop install stripe

# Linux
# Download from: https://stripe.com/docs/stripe-cli#install
```

### Step 2: Login to Stripe CLI
```bash
stripe login
```

### Step 3: Forward Webhooks to Local Server
```bash
stripe listen --forward-to localhost:5000/api/payment/webhook
```

### Step 4: Copy the Webhook Secret
After running the above command, you'll see something like:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxxxxxxxxxx
```
Copy this value and set it as `STRIPE_WEBHOOK_SECRET` in your backend `.env` file.

> [!IMPORTANT]
> Keep the `stripe listen` command running in a separate terminal while testing payments locally. This is the **third terminal** you need (Backend + Frontend + Stripe CLI).

---

## 12. Deployment Notes

### Frontend (Vercel)
The project includes a `vercel.json` for SPA routing:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
- Deploy via `vercel` CLI or connect the GitHub repo to Vercel Dashboard
- Set all `VITE_*` environment variables in Vercel project settings
- The `VITE_API_URL` should point to your deployed backend URL (e.g., `https://api.yourdomain.com/api`)

### Backend
- Can be deployed on **Render**, **Railway**, **Fly.io**, or any Node.js hosting
- Set all backend env variables in the hosting platform
- Update `FRONTEND_URL` to your deployed frontend URL
- Update the `allowedOrigins` array in `app.js` to include your production frontend URL
- For Stripe webhooks in production, create a webhook endpoint in Stripe Dashboard pointing to `https://your-backend.com/api/payment/webhook`

---

## 13. Troubleshooting

### ❌ "MongoDB connection error"
- Check your `MONGO_URI` connection string
- Ensure your IP is whitelisted in MongoDB Atlas (Network Access)
- Verify the database user credentials

### ❌ "CORS blocked" errors
- Check that `FRONTEND_URL` in backend `.env` matches your frontend URL exactly
- Check the `allowedOrigins` array in `backend/app.js`

### ❌ Google Auth not working
- Ensure all 3 Firebase env variables are set in frontend
- Ensure all 3 Firebase Admin env variables are set in backend
- Check that Google sign-in is enabled in Firebase Console > Authentication
- Verify `FIREBASE_PRIVATE_KEY` has correct `\n` formatting

### ❌ Stripe payments failing
- Ensure you're using **test mode** keys (starts with `sk_xxxx_`)
- Make sure `stripe listen` is running for local webhook forwarding
- Check that `STRIPE_WEBHOOK_SECRET` matches the CLI output

### ❌ Images not uploading
- Verify all 3 Cloudinary env variables
- Check your Cloudinary account hasn't exceeded the free tier limit

### ❌ Emails not sending
- Verify `RESEND_API_KEY` is correct
- Ensure your sender domain is verified in Resend Dashboard
- For testing, use `onboarding@resend.dev` as sender

### ❌ PDF receipt not generating
- `puppeteer-core` requires a Chromium binary
- The `@sparticuz/chromium` package provides this
- Locally, you may need to install Chromium: `npx @puppeteer/browsers install chromium`

---

## 📝 Quick Start Summary

```bash
# 1. Clone the repo
git clone <repo-url>
cd "Ecommerce With Backend"

# 2. Setup Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your actual values

# 3. Setup Frontend
cd ../frontend
npm install
cp .env.example .env
# Edit .env with your actual values

# 4. Start Backend (Terminal 1)
cd backend
npm run dev

# 5. Start Frontend (Terminal 2)
cd frontend
npm run dev

# 6. Start Stripe Webhook Listener (Terminal 3 — for payments)
stripe listen --forward-to localhost:5000/api/payment/webhook

# 7. Open browser
# Go to: http://localhost:5173
```

---

> [!NOTE]
> **Minimum 3 terminals needed for full functionality:**
> 1. Backend server (`npm run dev` in `/backend`)
> 2. Frontend dev server (`npm run dev` in `/frontend`)
> 3. Stripe webhook listener (`stripe listen --forward-to ...`)

---

*Last Updated: June 27, 2026*
