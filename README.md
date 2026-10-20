# RideOn – Bike Rental Website

RideOn is a full-stack bike rental web application that allows users to explore bikes, select rental dates and pickup/drop-off locations, manage bookings, and make test payments. It also provides an admin dashboard to manage bikes, bookings, and registered users.

## Features

- User registration and login
- Browse bikes and view bike details
- Filter bikes by location and category
- Select rental dates and pickup/drop-off locations
- Calculate rental booking amounts
- Razorpay test-payment integration
- View and cancel bookings
- Admin dashboard for managing bikes, bookings, and users
- MongoDB Atlas database integration

## Technology Stack

**Frontend**
- Vue.js 3
- JavaScript
- HTML and CSS
- Vite

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT authentication
- bcryptjs
- Razorpay test mode

## Project Structure

```text
Rideon/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── router/
│       └── views/
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites
- Node.js and npm
- MongoDB Atlas account
- Razorpay test account for payment testing

### 1. Clone the repository

```bash
git clone https://github.com/deepanshi-yadav/Rideon.git
cd Rideon
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

Create a `backend/.env` file with your own credentials:

```env
MONGO_URI=your_mongodb_connection_string
PORT=4000
JWT_SECRET=your_private_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

Start the backend:

```bash
node server.js
```

### 3. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

Create a `frontend/.env` file if needed:

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_test_key_id
```

Start the frontend:

```bash
npm run dev
```

Open the local URL shown in the terminal.

## Payment Notice

Razorpay is configured for testing. Test payments do not represent real transactions.

## Security

Never upload `.env` files, database passwords, or payment secrets to GitHub.

## Author

**Deepanshi Yadav**

GitHub: [deepanshi-yadav](https://github.com/deepanshi-yadav)
