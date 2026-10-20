# RideOn – Bike Rental Website

RideOn is a bike rental web application that allows users to explore available bikes, make bookings, manage their reservations, and complete test payments through Razorpay. It also includes an admin dashboard for managing bikes, bookings, and users.

## Features

- User registration and login
- Browse bikes and view bike details
- Search and filter bikes by location and category
- Select pickup and drop-off locations
- Choose rental dates and view booking amounts
- Make test payments using Razorpay
- View and cancel personal bookings
- Admin dashboard with booking, bike, and user management
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
- MongoDB Atlas and Mongoose
- JWT authentication
- bcryptjs for password hashing
- Razorpay test-mode integration

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
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB Atlas account
- Razorpay test-mode account for payment testing

### 1. Clone the repository

```bash
git clone https://github.com/deepanshi-yadav/Rideon.git
cd Rideon
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `backend/.env` file with your own configuration:

```env
MONGO_URI=your_mongodb_connection_string
PORT=4000
JWT_SECRET=your_private_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

Start the backend using the command configured in your backend `package.json`, or use:

```bash
node server.js
```

### 3. Configure the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env` and configure the public Razorpay test key if required by the frontend:

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_test_key_id
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite in your terminal.

## Payment Note

Razorpay is configured for testing. Test payments do not represent real transactions.

## Security

- Keep `.env` files and secret keys private.
- Never commit database credentials or payment secrets to GitHub.
- Use test credentials when testing payment functionality.

## Author

**Deepanshi Yadav**

GitHub: [deepanshi-yadav](https://github.com/deepanshi-yadav)
