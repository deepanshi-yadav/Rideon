import { createRouter, createWebHistory } from 'vue-router'

import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Bikes from '../views/Bikes.vue'
import Booking from '../views/Booking.vue'
import MyBookings from '../views/MyBookings.vue'
import Payment from '../views/Payment.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import AdminBookings from '../views/AdminBookings.vue'
import AdminBikes from '../views/AdminBikes.vue'
import AdminUsers from '../views/AdminUsers.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },

    {
      path: '/login',
      name: 'Login',
      component: Login
    },

    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },

    {
      path: '/bikes',
      name: 'Bikes',
      component: Bikes
    },

    {
      path: '/booking',
      name: 'Booking',
      component: Booking
    },

    {
      path: '/my-bookings',
      name: 'MyBookings',
      component: MyBookings
    },

    {
      path: '/payment',
      name: 'Payment',
      component: Payment
    },

    // Admin Dashboard
    {
      path: '/admin',
      name: 'AdminDashboard',
      component: AdminDashboard,
      meta: { requiresAdmin: true }
    },

    // Admin Bookings
    {
      path: '/admin/bookings',
      name: 'AdminBookings',
      component: AdminBookings,
      meta: { requiresAdmin: true }
    },

    // Admin Bikes
    {
      path: '/admin/bikes',
      name: 'AdminBikes',
      component: AdminBikes,
      meta: { requiresAdmin: true }
    },

    // Admin Users
    {
      path: '/admin/users',
      name: 'AdminUsers',
      component: AdminUsers,
      meta: { requiresAdmin: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))

  if (to.meta.requiresAdmin) {
    if (!user) {
      next('/login')
      return
    }

    if (user.role !== 'admin') {
      next('/')
      return
    }
  }

  next()
})

export default router