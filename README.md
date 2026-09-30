# 🌍 Wanderlust — Vacation Rental & Booking Platform

[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-v5.0-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-v5.3-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_Hosting-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Render](https://img.shields.io/badge/Deployed_on-Render-46E3B7?logo=render&logoColor=white)](https://render.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

> A full-stack vacation rental marketplace inspired by Airbnb. Browse stays, book dates with conflict checking, upload property photos, write reviews, and manage your properties and bookings from a personal dashboard.

🔗 **Live Demo:** [wanderlust-db59.onrender.com](https://wanderlust-db59.onrender.com/listings)

---

## 📸 Key Features

### 🏡 Listings Management (CRUD)
- Create, browse, update, and remove property listings.
- Image uploads powered by **Cloudinary** and **Multer**.
- Listing details include title, description, price per night, country, and location.

### 🔍 Search & Category Filters
- Filter listings by dynamic categories:
  - *Trending*, *Rooms*, *Iconic Cities*, *Mountains*, *Castles*, *Amazing Pools*, *Camping*, *Farms*, *Arctic*.
- Instant search bar to search listings by destination, country, or location.

### 📅 Booking System
- Select check-in and check-out dates.
- Automatic night and total price calculation.
- Built-in validation:
  - Disallows past dates or check-out before check-in.
  - **Overlap detection**: Prevents double-booking for the same property during reserved dates.
- Users can manage and cancel their bookings from the dashboard.

### ⭐ Reviews & Star Ratings
- Leave interactive 1-to-5 star ratings and feedback using Starability.
- Cascade deletion: Deleting a listing automatically removes all associated reviews.
- Strict authorization: Only the author of a review can delete it.

### 💖 Wishlist
- Add or remove stays from your personal wishlist with a single click.
- Access saved favorites directly from your navigation bar.

### 👤 User Dashboard & Profiles
- Dedicated `/dashboard` page displaying:
  - **Your Listings**: Manage listings you own (edit/delete).
  - **Your Bookings**: View confirmed bookings and total payments.
  - **Your Reviews**: Track reviews you have submitted across properties.

### 🗺️ Geocoding & Maps
- Automatic geocoding via OpenStreetMap (Nominatim API) converts text locations into geographic coordinates.

### 🔐 Authentication & Authorization
- Secure user registration, login, and session persistence using **Passport.js**.
- Route guards and middleware protect unauthorized modification of listings and bookings.
- Robust schema validation using **Joi**.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | EJS, EJS-Mate layouts, Bootstrap 5, FontAwesome, Starability CSS |
| **Backend** | Node.js, Express.js 5 |
| **Database** | MongoDB & Mongoose ORM |
| **Authentication** | Passport.js (`passport-local`, `passport-local-mongoose`), Express Session |
| **Media Storage** | Cloudinary & Multer Storage Cloudinary |
| **Validation** | Joi |
| **Geocoding** | OpenStreetMap / Nominatim API |
| **Hosting** | Render Web Services (Backend) + MongoDB Atlas (Database) |

---

## 📂 Project Structure

```plaintext
major/
├── controllers/          # Request handlers & business logic
│   ├── bookings.js       # Booking operations (create, cancel)
│   ├── listings.js       # Listing CRUD & search logic
│   ├── reviews.js        # Review creation & deletion
│   └── users.js          # Authentication, dashboard & wishlist
├── models/               # Mongoose data schemas
│   ├── booking.js
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── routes/               # Express routing modules
│   ├── booking.js
│   ├── listing.js
│   ├── reviews.js
│   └── user.js
├── views/                # EJS templates & layouts
│   ├── includes/         # Navbar, footer, flash alerts
│   ├── layouts/          # Boilerplate HTML layout
│   ├── listings/         # Listing views (index, show, new, edit)
│   ├── reviews/          # Review views
│   └── users/            # Login, signup, dashboard, wishlist
├── init/                 # Sample seed data & initialization script
│   ├── data.js           # Sample listings dataset
│   └── index.js          # Seeding script with geocoding
├── public/               # Static assets (CSS, JS, images)
├── utils/                # Error handling utilities (ExpressError, wrapAsync)
├── app.js                # Application entry point & middleware config
├── cloudConfi.js         # Cloudinary configuration
├── middleware.js         # Authentication & authorization middleware
├── schema.js             # Joi validation schemas
└── package.json          # Project metadata & dependencies
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas account)
- [Cloudinary Account](https://cloudinary.com/) (Free tier)

### 1. Clone the Repository
```bash
git clone https://github.com/BalakaLaluthVardhan/Wanderlust.git
cd Wanderlust
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add the following keys:

```env
# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Database Configuration (Optional for local MongoDB)
ATLASDB_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/wanderlust?retryWrites=true&w=majority

# Port (Optional, defaults to 8080)
PORT=8080
```

> **Note:** If `ATLASDB_URL` is omitted, the application defaults to local MongoDB: `mongodb://127.0.0.1:27017/wanderlust`.

### 4. Seed the Database (Optional)
Populate your database with sample listings:
```bash
node init/index.js
```

### 5. Start the Server
```bash
node app.js
```
Open your browser and navigate to `http://localhost:8080/listings`.

---

## 🌐 Deployment Notes (Render + MongoDB Atlas)

When deploying on containerized cloud platforms like **Render**:
- **DNS SRV Records:** Node.js may experience `querySrv ENOTFOUND` when querying Atlas clusters through cloud virtual DNS. `app.js` includes custom DNS servers (`8.8.8.8`, `1.1.1.1`) to ensure reliable SRV lookup.
- **MongoDB Atlas Network Access:** Ensure your Atlas cluster's Network Access has `0.0.0.0/0` (Allow Access from Anywhere) enabled to accommodate Render's dynamic IP ranges.
- **Environment Variables:** Set `NODE_ENV=production`, `ATLASDB_URL`, `CLOUD_NAME`, `CLOUD_API_KEY`, and `CLOUD_API_SECRET` in the Render Environment settings.

