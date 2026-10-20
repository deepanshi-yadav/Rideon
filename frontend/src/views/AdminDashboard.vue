<template>
  <div class="admin-page">

    <!-- HEADER -->

    <section class="admin-header">

      <div>
        <p class="small-title">
          RIDEON ADMIN
        </p>

        <h1>
          Admin <span>Dashboard.</span>
        </h1>

        <p class="subtitle">
          Manage bikes, bookings and users from one place.
        </p>
      </div>

      <button
        class="logout-button"
        @click="logout"
      >
        Logout
      </button>

    </section>


    <!-- DASHBOARD -->

    <section class="dashboard-section">

      <!-- ERROR -->

      <div
        v-if="error"
        class="error-message"
      >
        {{ error }}
      </div>


      <!-- STAT CARDS -->

      <div class="stats-grid">

        <!-- BIKES -->

        <div class="stat-card">

          <p>
            Total Bikes
          </p>

          <h2>
            {{ loading ? '...' : totalBikes }}
          </h2>

          <span>
            Bikes in RideOn
          </span>

        </div>


        <!-- BOOKINGS -->

        <div class="stat-card">

          <p>
            Total Bookings
          </p>

          <h2>
            {{ loading ? '...' : totalBookings }}
          </h2>

          <span>
            Customer bookings
          </span>

        </div>


        <!-- USERS -->

        <div class="stat-card">

          <p>
            Total Users
          </p>

          <h2>
            {{ loading ? '...' : totalUsers }}
          </h2>

          <span>
            Registered customers
          </span>

        </div>

      </div>


      <!-- MANAGEMENT -->

      <div class="section-title">

        <p>
          MANAGEMENT
        </p>

        <h2>
          Admin Controls
        </h2>

      </div>


      <div class="management-grid">

        <!-- BIKES -->

        <div class="management-card">

          <div class="card-icon">
            🏍️
          </div>

          <h3>
            Manage Bikes
          </h3>

          <p>
            Add new bikes, update bike details
            and remove unavailable bikes.
          </p>

          <button
            class="action-button"
            @click="goToBikes"
          >
            Manage Bikes
          </button>

        </div>


        <!-- BOOKINGS -->

        <div class="management-card">

          <div class="card-icon">
            📋
          </div>

          <h3>
            Manage Bookings
          </h3>

          <p>
            View all customer bookings and
            their booking status.
          </p>

          <button
            class="action-button"
            @click="goToBookings"
          >
            View Bookings
          </button>

        </div>


        <!-- USERS -->

        <div class="management-card">

          <div class="card-icon">
            👤
          </div>

          <h3>
            Manage Users
          </h3>

          <p>
            View registered RideOn customers
            and their account information.
          </p>

          <button
            class="action-button"
            @click="goToUsers"
          >
            View Users
          </button>

        </div>

      </div>

    </section>

  </div>
</template>


<script setup>

import {
  ref,
  onMounted
} from 'vue'

import {
  useRouter
} from 'vue-router'


const router = useRouter()


// Dashboard numbers

const totalBikes = ref(0)

const totalBookings = ref(0)

const totalUsers = ref(0)


// Page state

const error = ref('')

const loading = ref(true)


// Fetch dashboard statistics

const fetchDashboardStats = async () => {

  try {

    const token =
      localStorage.getItem('token')


    // User is not logged in

    if (!token) {

      router.push('/login')

      return

    }


    const response =
      await fetch(
        'http://localhost:4000/api/admin/stats',
        {
          method: 'GET',

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      )


    const data =
      await response.json()


    if (!response.ok) {

      throw new Error(
        data.message ||
        'Failed to load dashboard'
      )

    }


    // Store MongoDB counts

    totalBikes.value =
      data.totalBikes

    totalBookings.value =
      data.totalBookings

    totalUsers.value =
      data.totalUsers


  } catch (err) {

    console.error(err)

    error.value =
      err.message ||
      'Unable to load dashboard.'


  } finally {

    loading.value = false

  }

}


// Go to Manage Bikes

const goToBikes = () => {

  router.push('/admin/bikes')

}


// Go to Manage Bookings

const goToBookings = () => {

  router.push('/admin/bookings')

}


// Go to Manage Users

const goToUsers = () => {

  router.push('/admin/users')

}


// Logout

const logout = () => {

  localStorage.removeItem('token')

  localStorage.removeItem('user')

  router.push('/login')

}


// Load dashboard when page opens

onMounted(() => {

  fetchDashboardStats()

})

</script>


<style scoped>

.admin-page {

  min-height: 100vh;

  background: #f5f7fa;

  color: #111827;

}


/* HEADER */

.admin-header {

  padding: 55px 7%;

  background:
    linear-gradient(
      135deg,
      #111827,
      #1f2937
    );

  color: white;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 30px;

}


.small-title {

  margin: 0 0 12px;

  color: #d1d5db;

  font-size: 12px;

  font-weight: 700;

  letter-spacing: 3px;

}


.admin-header h1 {

  margin: 0 0 12px;

  font-size: 44px;

  font-weight: 800;

  letter-spacing: -1px;

}


.admin-header h1 span {

  color: #60a5fa;

}


.subtitle {

  margin: 0;

  color: #d1d5db;

  font-size: 16px;

}


/* LOGOUT */

.logout-button {

  border: 1px solid #6b7280;

  background: transparent;

  color: white;

  padding: 11px 20px;

  border-radius: 7px;

  font-size: 13px;

  font-weight: 700;

  cursor: pointer;

  transition: 0.2s;

}


.logout-button:hover {

  background: white;

  color: #111827;

}


/* MAIN SECTION */

.dashboard-section {

  width: 86%;

  max-width: 1300px;

  margin: auto;

  padding: 55px 0 80px;

}


/* ERROR */

.error-message {

  margin-bottom: 25px;

  padding: 14px 18px;

  background: #fee2e2;

  color: #991b1b;

  border: 1px solid #fecaca;

  border-radius: 8px;

  font-size: 14px;

}


/* STAT CARDS */

.stats-grid {

  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 24px;

  margin-bottom: 60px;

}


.stat-card {

  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 15px;

  padding: 25px;

  box-shadow:
    0 5px 20px
    rgba(0, 0, 0, 0.05);

}


.stat-card p {

  margin: 0 0 10px;

  color: #6b7280;

  font-size: 13px;

  font-weight: 600;

}


.stat-card h2 {

  margin: 0 0 7px;

  font-size: 32px;

}


.stat-card span {

  color: #9ca3af;

  font-size: 12px;

}


/* SECTION TITLE */

.section-title {

  margin-bottom: 25px;

}


.section-title p {

  margin: 0 0 6px;

  color: #2563eb;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 3px;

}


.section-title h2 {

  margin: 0;

  font-size: 30px;

}


/* MANAGEMENT CARDS */

.management-grid {

  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 25px;

}


.management-card {

  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 15px;

  padding: 28px;

  box-shadow:
    0 5px 20px
    rgba(0, 0, 0, 0.05);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

}


.management-card:hover {

  transform: translateY(-4px);

  box-shadow:
    0 15px 35px
    rgba(0, 0, 0, 0.1);

}


.card-icon {

  width: 50px;

  height: 50px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #eff6ff;

  border-radius: 10px;

  font-size: 24px;

  margin-bottom: 20px;

}


.management-card h3 {

  margin: 0 0 8px;

  font-size: 20px;

}


.management-card p {

  margin: 0 0 20px;

  color: #6b7280;

  font-size: 13px;

  line-height: 1.6;

}


/* BUTTON */

.action-button {

  border: none;

  background: #2563eb;

  color: white;

  padding: 10px 16px;

  border-radius: 6px;

  font-size: 12px;

  font-weight: 700;

  cursor: pointer;

  transition: 0.2s;

}


.action-button:hover {

  background: #3b82f6;

}


/* RESPONSIVE */

@media (max-width: 900px) {

  .stats-grid,
  .management-grid {

    grid-template-columns: 1fr;

  }

}


@media (max-width: 600px) {

  .admin-header {

    padding: 45px 25px;

    align-items: flex-start;

    flex-direction: column;

  }


  .admin-header h1 {

    font-size: 36px;

  }


  .dashboard-section {

    width: 90%;

    padding: 45px 0 60px;

  }

}

</style>