```vue
<template>
  <div class="admin-bookings-page">

    <!-- HEADER -->

    <section class="page-header">

      <div>
        <p class="small-title">
          RIDEON ADMIN
        </p>

        <h1>
          Manage <span>Bookings.</span>
        </h1>

        <p class="subtitle">
          View and manage all customer bookings.
        </p>
      </div>

      <router-link
        to="/admin"
        class="back-button"
      >
        ← Dashboard
      </router-link>

    </section>


    <!-- CONTENT -->

    <main class="content">

      <!-- ERROR -->

      <div
        v-if="error"
        class="error-message"
      >
        {{ error }}
      </div>


      <!-- SUMMARY -->

      <div class="summary-grid">

        <div class="summary-card">
          <span>Total</span>
          <strong>{{ bookings.length }}</strong>
        </div>

        <div class="summary-card">
          <span>Confirmed</span>
          <strong>{{ confirmedBookings }}</strong>
        </div>

        <div class="summary-card">
          <span>Cancelled</span>
          <strong>{{ cancelledBookings }}</strong>
        </div>

        <div class="summary-card">
          <span>Pending</span>
          <strong>{{ pendingBookings }}</strong>
        </div>

      </div>


      <!-- TITLE -->

      <div class="section-heading">

        <div>
          <p>BOOKINGS</p>
          <h2>All Customer Bookings</h2>
        </div>

        <button
          class="refresh-button"
          @click="fetchBookings"
        >
          Refresh
        </button>

      </div>


      <!-- LOADING -->

      <div
        v-if="loading"
        class="state-box"
      >
        Loading bookings...
      </div>


      <!-- EMPTY -->

      <div
        v-else-if="bookings.length === 0"
        class="state-box"
      >
        No bookings found.
      </div>


      <!-- BOOKINGS -->

      <div
        v-else
        class="booking-list"
      >

        <div
          v-for="booking in bookings"
          :key="booking._id"
          class="booking-card"
        >

          <!-- BIKE -->

          <div class="bike-section">

            <div class="bike-image">

              <img
                v-if="booking.bike?.image"
                :src="booking.bike.image"
                :alt="booking.bike?.name"
              />

              <div
                v-else
                class="no-image"
              >
                🏍️
              </div>

            </div>

            <div>
              <p class="bike-brand">
                {{ booking.bike?.brand || 'RideOn' }}
              </p>

              <h3>
                {{ booking.bike?.name || 'Bike' }}
              </h3>

              <span class="bike-type">
                {{ booking.bike?.type || 'Bike Rental' }}
              </span>
            </div>

          </div>


          <!-- CUSTOMER -->

          <div class="booking-info">

            <div class="info-item">

              <span>Customer</span>

              <strong>
                {{ booking.user?.name || 'Unknown' }}
              </strong>

            </div>


            <div class="info-item">

              <span>Email</span>

              <strong>
                {{ booking.user?.email || '—' }}
              </strong>

            </div>


            <div class="info-item">

              <span>Phone</span>

              <strong>
                {{ booking.user?.phone || '—' }}
              </strong>

            </div>


            <div class="info-item">

              <span>Pickup</span>

              <strong>
                {{ booking.pickupLocation || '—' }}
              </strong>

            </div>


            <div class="info-item">

              <span>Drop-off</span>

              <strong>
                {{ booking.dropoffLocation || '—' }}
              </strong>

            </div>


            <div class="info-item">

              <span>Start Date</span>

              <strong>
                {{ formatDate(booking.startDate) }}
              </strong>

            </div>


            <div class="info-item">

              <span>End Date</span>

              <strong>
                {{ formatDate(booking.endDate) }}
              </strong>

            </div>


            <div class="info-item">

              <span>Total Amount</span>

              <strong>
                ₹{{ booking.totalAmount }}
              </strong>

            </div>


            <div class="info-item">

              <span>Status</span>

              <strong
                class="status"
                :class="booking.status"
              >
                {{ booking.status }}
              </strong>

            </div>

          </div>

        </div>

      </div>

    </main>

  </div>
</template>


<script setup>

import {
  ref,
  computed,
  onMounted
} from 'vue'

import {
  useRouter
} from 'vue-router'


const router = useRouter()


const bookings = ref([])

const loading = ref(true)

const error = ref('')


/* =========================
   FETCH BOOKINGS
========================= */

const fetchBookings = async () => {

  try {

    error.value = ''

    loading.value = true


    const token =
      localStorage.getItem('token')


    if (!token) {

      router.push('/login')

      return

    }


    const response =
      await fetch(
        'http://localhost:4000/api/bookings',
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
        'Failed to load bookings'
      )

    }


    bookings.value = data


  } catch (err) {

    console.error(err)

    error.value =
      err.message ||
      'Unable to load bookings.'

  } finally {

    loading.value = false

  }

}


/* =========================
   BOOKING COUNTS
========================= */

const confirmedBookings =
  computed(() => {

    return bookings.value.filter(
      booking =>
        booking.status === 'confirmed'
    ).length

  })


const cancelledBookings =
  computed(() => {

    return bookings.value.filter(
      booking =>
        booking.status === 'cancelled'
    ).length

  })


const pendingBookings =
  computed(() => {

    return bookings.value.filter(
      booking =>
        booking.status === 'pending'
    ).length

  })


/* =========================
   DATE FORMAT
========================= */

const formatDate = (date) => {

  if (!date) {
    return '—'
  }

  return new Date(date).toLocaleDateString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }
  )

}


/* =========================
   PAGE LOAD
========================= */

onMounted(() => {

  fetchBookings()

})

</script>


<style scoped>

.admin-bookings-page {

  min-height: 100vh;

  background: #f5f7fa;

  color: #111827;

}


/* HEADER */

.page-header {

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


.page-header h1 {

  margin: 0 0 12px;

  font-size: 44px;

  font-weight: 800;

}


.page-header h1 span {

  color: #60a5fa;

}


.subtitle {

  margin: 0;

  color: #d1d5db;

  font-size: 16px;

}


.back-button {

  text-decoration: none;

  border: 1px solid #6b7280;

  color: white;

  padding: 11px 18px;

  border-radius: 7px;

  font-size: 13px;

  font-weight: 700;

}


.back-button:hover {

  background: white;

  color: #111827;

}


/* CONTENT */

.content {

  width: 86%;

  max-width: 1300px;

  margin: auto;

  padding: 50px 0 80px;

}


/* ERROR */

.error-message {

  margin-bottom: 25px;

  padding: 14px 18px;

  background: #fee2e2;

  color: #991b1b;

  border: 1px solid #fecaca;

  border-radius: 8px;

}


/* SUMMARY */

.summary-grid {

  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 20px;

  margin-bottom: 55px;

}


.summary-card {

  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 12px;

  padding: 22px;

  box-shadow:
    0 5px 20px
    rgba(0, 0, 0, 0.05);

}


.summary-card span {

  display: block;

  color: #6b7280;

  font-size: 12px;

  margin-bottom: 8px;

}


.summary-card strong {

  font-size: 28px;

}


/* SECTION */

.section-heading {

  display: flex;

  align-items: end;

  justify-content: space-between;

  margin-bottom: 25px;

}


.section-heading p {

  margin: 0 0 5px;

  color: #2563eb;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 3px;

}


.section-heading h2 {

  margin: 0;

  font-size: 28px;

}


.refresh-button {

  border: 1px solid #d1d5db;

  background: white;

  color: #111827;

  padding: 10px 16px;

  border-radius: 7px;

  cursor: pointer;

  font-weight: 600;

}


/* STATE */

.state-box {

  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 12px;

  padding: 60px;

  text-align: center;

  color: #6b7280;

}


/* BOOKING CARD */

.booking-list {

  display: flex;

  flex-direction: column;

  gap: 20px;

}


.booking-card {

  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 14px;

  padding: 22px;

  box-shadow:
    0 5px 20px
    rgba(0, 0, 0, 0.05);

}


/* BIKE */

.bike-section {

  display: flex;

  align-items: center;

  gap: 18px;

  padding-bottom: 20px;

  border-bottom: 1px solid #e5e7eb;

}


.bike-image {

  width: 100px;

  height: 75px;

  border-radius: 8px;

  overflow: hidden;

  background: #e5e7eb;

  flex-shrink: 0;

}


.bike-image img {

  width: 100%;

  height: 100%;

  object-fit: cover;

}


.no-image {

  width: 100%;

  height: 100%;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 25px;

}


.bike-brand {

  margin: 0 0 3px;

  color: #2563eb;

  font-size: 11px;

  font-weight: 700;

  text-transform: uppercase;

  letter-spacing: 1px;

}


.bike-section h3 {

  margin: 0 0 4px;

  font-size: 20px;

}


.bike-type {

  color: #6b7280;

  font-size: 12px;

}


/* INFO */

.booking-info {

  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 20px;

  padding-top: 20px;

}


.info-item {

  display: flex;

  flex-direction: column;

  gap: 5px;

}


.info-item span {

  color: #9ca3af;

  font-size: 10px;

  text-transform: uppercase;

  letter-spacing: 0.5px;

}


.info-item strong {

  font-size: 13px;

  word-break: break-word;

}


/* STATUS */

.status {

  display: inline-block;

  width: fit-content;

  padding: 5px 9px;

  border-radius: 20px;

  text-transform: capitalize;

}


.status.confirmed {

  background: #dcfce7;

  color: #166534;

}


.status.cancelled {

  background: #fee2e2;

  color: #991b1b;

}


.status.pending {

  background: #fef3c7;

  color: #92400e;

}


.status.completed {

  background: #dbeafe;

  color: #1e40af;

}


/* RESPONSIVE */

@media (max-width: 1000px) {

  .summary-grid {

    grid-template-columns:
      repeat(2, 1fr);

  }

  .booking-info {

    grid-template-columns:
      repeat(2, 1fr);

  }

}


@media (max-width: 600px) {

  .page-header {

    padding: 45px 25px;

    align-items: flex-start;

    flex-direction: column;

  }

  .page-header h1 {

    font-size: 36px;

  }

  .content {

    width: 90%;

  }

  .summary-grid {

    grid-template-columns: 1fr;

  }

  .booking-info {

    grid-template-columns: 1fr;

  }

}

</style>
```
