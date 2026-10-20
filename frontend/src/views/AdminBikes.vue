<template>
  <div class="admin-bikes-page">

    <!-- HEADER -->

    <section class="page-header">

      <div>
        <p class="small-title">
          RIDEON ADMIN
        </p>

        <h1>
          Manage <span>Bikes.</span>
        </h1>

        <p class="subtitle">
          Add, update and remove bikes from RideOn.
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

      <!-- MESSAGE -->

      <div
        v-if="message"
        class="success-message"
      >
        {{ message }}
      </div>

      <div
        v-if="error"
        class="error-message"
      >
        {{ error }}
      </div>


      <!-- ADD BIKE -->

      <section class="form-card">

        <div class="section-heading">

          <div>
            <p>BIKE MANAGEMENT</p>

            <h2>
              {{ editingBike ? 'Edit Bike' : 'Add New Bike' }}
            </h2>
          </div>

        </div>


        <form @submit.prevent="saveBike">

          <div class="form-grid">

            <div class="form-group">
              <label>Bike Name</label>

              <input
                v-model="form.name"
                type="text"
                placeholder="e.g. Classic 350"
                required
              />
            </div>


            <div class="form-group">
              <label>Brand</label>

              <input
                v-model="form.brand"
                type="text"
                placeholder="e.g. Royal Enfield"
                required
              />
            </div>


            <div class="form-group">
              <label>Type</label>

              <input
                v-model="form.type"
                type="text"
                placeholder="e.g. Cruiser"
                required
              />
            </div>


            <div class="form-group">
              <label>Price Per Day</label>

              <input
                v-model.number="form.pricePerDay"
                type="number"
                min="1"
                placeholder="e.g. 1300"
                required
              />
            </div>


            <div class="form-group">
              <label>Location</label>

              <input
                v-model="form.location"
                type="text"
                placeholder="e.g. Delhi"
                required
              />
            </div>


            <div class="form-group">
              <label>Stock</label>

              <input
                v-model.number="form.stock"
                type="number"
                min="0"
                placeholder="e.g. 10"
                required
              />
            </div>

          </div>


          <div class="form-group full-width">

            <label>Image URL</label>

            <input
              v-model="form.image"
              type="url"
              placeholder="https://example.com/bike.jpg"
            />

          </div>


          <div class="form-group full-width">

            <label>Description</label>

            <textarea
              v-model="form.description"
              rows="4"
              placeholder="Enter bike description"
            ></textarea>

          </div>


          <div class="form-actions">

            <button
              type="submit"
              class="primary-button"
              :disabled="saving"
            >
              {{ saving
                ? 'Saving...'
                : editingBike
                  ? 'Update Bike'
                  : 'Add Bike'
              }}
            </button>


            <button
              v-if="editingBike"
              type="button"
              class="secondary-button"
              @click="cancelEdit"
            >
              Cancel
            </button>

          </div>

        </form>

      </section>


      <!-- BIKES LIST -->

      <section class="list-section">

        <div class="section-heading list-heading">

          <div>
            <p>RIDEON BIKES</p>

            <h2>
              All Bikes
            </h2>
          </div>

          <button
            class="refresh-button"
            @click="fetchBikes"
          >
            Refresh
          </button>

        </div>


        <div
          v-if="loading"
          class="state-box"
        >
          Loading bikes...
        </div>


        <div
          v-else-if="bikes.length === 0"
          class="state-box"
        >
          No bikes found.
        </div>


        <div
          v-else
          class="bike-grid"
        >

          <div
            v-for="bike in bikes"
            :key="bike._id"
            class="bike-card"
          >

            <div class="bike-image">

              <img
                v-if="bike.image"
                :src="bike.image"
                :alt="bike.name"
              />

              <div
                v-else
                class="no-image"
              >
                🏍️
              </div>

            </div>


            <div class="bike-details">

              <p class="bike-brand">
                {{ bike.brand }}
              </p>

              <h3>
                {{ bike.name }}
              </h3>

              <span class="bike-type">
                {{ bike.type }}
              </span>


              <div class="bike-meta">

                <div>
                  <span>Price</span>
                  <strong>₹{{ bike.pricePerDay }}/day</strong>
                </div>

                <div>
                  <span>Stock</span>
                  <strong>{{ bike.stock }}</strong>
                </div>

                <div>
                  <span>Location</span>
                  <strong>{{ bike.location }}</strong>
                </div>

              </div>


              <div class="bike-actions">

                <button
                  class="edit-button"
                  @click="editBike(bike)"
                >
                  Edit
                </button>

                <button
                  class="delete-button"
                  @click="deleteBike(bike._id)"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>

  </div>
</template>


<script setup>

import {
  ref,
  reactive,
  onMounted
} from 'vue'

import {
  useRouter
} from 'vue-router'


const router = useRouter()


const bikes = ref([])

const loading = ref(true)

const saving = ref(false)

const error = ref('')

const message = ref('')

const editingBike = ref(null)


const form = reactive({
  name: '',
  brand: '',
  type: '',
  pricePerDay: 0,
  location: '',
  image: '',
  description: '',
  stock: 1
})


const getToken = () => {

  const token =
    localStorage.getItem('token')

  if (!token) {

    router.push('/login')

    return null

  }

  return token

}


/* =========================
   FETCH BIKES
========================= */

const fetchBikes = async () => {

  try {

    error.value = ''

    loading.value = true

    const response =
      await fetch(
        'http://localhost:4000/api/bikes'
      )


    const data =
      await response.json()


    if (!response.ok) {

      throw new Error(
        data.message ||
        'Failed to load bikes'
      )

    }


    bikes.value = data

  } catch (err) {

    console.error(err)

    error.value =
      err.message ||
      'Unable to load bikes.'

  } finally {

    loading.value = false

  }

}


/* =========================
   SAVE BIKE
========================= */

const saveBike = async () => {

  try {

    error.value = ''

    message.value = ''

    saving.value = true


    const token = getToken()

    if (!token) {
      return
    }


    const url =
      editingBike.value
        ? `http://localhost:4000/api/bikes/${editingBike.value._id}`
        : 'http://localhost:4000/api/bikes'


    const method =
      editingBike.value
        ? 'PUT'
        : 'POST'


    const response =
      await fetch(
        url,
        {
          method,

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`
          },

          body:
            JSON.stringify(form)
        }
      )


    const data =
      await response.json()


    if (!response.ok) {

      throw new Error(
        data.message ||
        'Failed to save bike'
      )

    }


    message.value =
      editingBike.value
        ? 'Bike updated successfully.'
        : 'Bike added successfully.'


    resetForm()

    await fetchBikes()


  } catch (err) {

    console.error(err)

    error.value =
      err.message ||
      'Unable to save bike.'

  } finally {

    saving.value = false

  }

}


/* =========================
   EDIT BIKE
========================= */

const editBike = (bike) => {

  editingBike.value = bike


  form.name =
    bike.name || ''

  form.brand =
    bike.brand || ''

  form.type =
    bike.type || ''

  form.pricePerDay =
    bike.pricePerDay || 0

  form.location =
    bike.location || ''

  form.image =
    bike.image || ''

  form.description =
    bike.description || ''

  form.stock =
    bike.stock ?? 1


  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })

}


/* =========================
   DELETE BIKE
========================= */

const deleteBike = async (id) => {

  try {

    error.value = ''

    message.value = ''


    const token = getToken()

    if (!token) {
      return
    }


    const response =
      await fetch(
        `http://localhost:4000/api/bikes/${id}`,
        {
          method: 'DELETE',

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
        'Failed to delete bike'
      )

    }


    message.value =
      'Bike deleted successfully.'


    await fetchBikes()


  } catch (err) {

    console.error(err)

    error.value =
      err.message ||
      'Unable to delete bike.'

  }

}


/* =========================
   RESET FORM
========================= */

const resetForm = () => {

  editingBike.value = null

  form.name = ''

  form.brand = ''

  form.type = ''

  form.pricePerDay = 0

  form.location = ''

  form.image = ''

  form.description = ''

  form.stock = 1

}


/* =========================
   CANCEL EDIT
========================= */

const cancelEdit = () => {

  resetForm()

  error.value = ''

  message.value = ''

}


/* =========================
   PAGE LOAD
========================= */

onMounted(() => {

  fetchBikes()

})

</script>


<style scoped>

.admin-bikes-page {

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


/* MESSAGES */

.success-message {

  margin-bottom: 25px;

  padding: 14px 18px;

  background: #dcfce7;

  color: #166534;

  border: 1px solid #bbf7d0;

  border-radius: 8px;

}


.error-message {

  margin-bottom: 25px;

  padding: 14px 18px;

  background: #fee2e2;

  color: #991b1b;

  border: 1px solid #fecaca;

  border-radius: 8px;

}


/* FORM */

.form-card {

  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 14px;

  padding: 30px;

  margin-bottom: 55px;

  box-shadow:
    0 5px 20px
    rgba(0, 0, 0, 0.05);

}


.section-heading {

  margin-bottom: 25px;

}


.section-heading p {

  margin: 0 0 6px;

  color: #2563eb;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 3px;

}


.section-heading h2 {

  margin: 0;

  font-size: 28px;

}


.form-grid {

  display: grid;

  grid-template-columns:
    repeat(2, 1fr);

  gap: 20px;

}


.form-group {

  display: flex;

  flex-direction: column;

  gap: 7px;

  margin-bottom: 20px;

}


.full-width {

  width: 100%;

}


.form-group label {

  color: #374151;

  font-size: 12px;

  font-weight: 700;

}


.form-group input,
.form-group textarea {

  width: 100%;

  box-sizing: border-box;

  border: 1px solid #d1d5db;

  border-radius: 7px;

  padding: 11px 12px;

  font-family: inherit;

  font-size: 13px;

  outline: none;

}


.form-group input:focus,
.form-group textarea:focus {

  border-color: #2563eb;

}


.form-group textarea {

  resize: vertical;

}


.form-actions {

  display: flex;

  gap: 12px;

}


.primary-button {

  border: none;

  background: #2563eb;

  color: white;

  padding: 11px 18px;

  border-radius: 7px;

  font-size: 13px;

  font-weight: 700;

  cursor: pointer;

}


.primary-button:hover {

  background: #3b82f6;

}


.primary-button:disabled {

  opacity: 0.6;

  cursor: not-allowed;

}


.secondary-button {

  border: 1px solid #d1d5db;

  background: white;

  color: #111827;

  padding: 11px 18px;

  border-radius: 7px;

  font-size: 13px;

  font-weight: 700;

  cursor: pointer;

}


/* LIST */

.list-heading {

  display: flex;

  align-items: end;

  justify-content: space-between;

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


/* BIKE GRID */

.bike-grid {

  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 22px;

}


.bike-card {

  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 14px;

  overflow: hidden;

  box-shadow:
    0 5px 20px
    rgba(0, 0, 0, 0.05);

}


.bike-image {

  width: 100%;

  height: 190px;

  background: #e5e7eb;

  overflow: hidden;

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

  font-size: 45px;

}


.bike-details {

  padding: 22px;

}


.bike-brand {

  margin: 0 0 5px;

  color: #2563eb;

  font-size: 11px;

  font-weight: 700;

  text-transform: uppercase;

  letter-spacing: 1px;

}


.bike-details h3 {

  margin: 0 0 5px;

  font-size: 20px;

}


.bike-type {

  color: #6b7280;

  font-size: 12px;

}


.bike-meta {

  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 10px;

  margin: 20px 0;

  padding-top: 18px;

  border-top: 1px solid #e5e7eb;

}


.bike-meta div {

  display: flex;

  flex-direction: column;

  gap: 4px;

}


.bike-meta span {

  color: #9ca3af;

  font-size: 9px;

  text-transform: uppercase;

}


.bike-meta strong {

  font-size: 12px;

}


.bike-actions {

  display: flex;

  gap: 10px;

}


.edit-button,
.delete-button {

  flex: 1;

  padding: 9px;

  border-radius: 6px;

  font-size: 12px;

  font-weight: 700;

  cursor: pointer;

}


.edit-button {

  border: 1px solid #2563eb;

  background: white;

  color: #2563eb;

}


.delete-button {

  border: 1px solid #dc2626;

  background: white;

  color: #dc2626;

}


.edit-button:hover {

  background: #eff6ff;

}


.delete-button:hover {

  background: #fef2f2;

}


/* RESPONSIVE */

@media (max-width: 1000px) {

  .bike-grid {

    grid-template-columns:
      repeat(2, 1fr);

  }

}


@media (max-width: 700px) {

  .form-grid {

    grid-template-columns: 1fr;

  }

  .bike-grid {

    grid-template-columns: 1fr;

  }

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

}

</style>