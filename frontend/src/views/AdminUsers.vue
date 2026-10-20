<template>
  <div class="users-page">

    <!-- Header -->
    <div class="page-header">
      <div>
        <p class="page-label">ADMIN PANEL</p>
        <h1>Manage Users</h1>
        <p class="subtitle">
          View and manage registered RideOn customers.
        </p>
      </div>

      <div class="header-actions">
        <button class="refresh-btn" @click="fetchUsers">
          Refresh
        </button>

        <button class="back-btn" @click="goToDashboard">
          Back to Dashboard
        </button>
      </div>
    </div>

    <!-- Message -->
    <div v-if="message" class="message success">
      {{ message }}
    </div>

    <div v-if="error" class="message error">
      {{ error }}
    </div>

    <!-- Stats -->
    <div class="stats-card">
      <div>
        <span class="stats-label">TOTAL REGISTERED USERS</span>
        <h2>{{ users.length }}</h2>
      </div>

      <div class="user-icon">
        👤
      </div>
    </div>

    <!-- Users -->
    <div class="users-card">

      <div class="card-header">
        <div>
          <h2>Registered Customers</h2>
          <p>All normal users registered on RideOn.</p>
        </div>
      </div>

      <div v-if="loading" class="loading">
        Loading users...
      </div>

      <div v-else-if="users.length === 0" class="empty">
        No users registered yet.
      </div>

      <div v-else class="users-list">

        <div
          v-for="user in users"
          :key="user._id"
          class="user-row"
        >

          <div class="avatar">
            {{ getInitials(user.name) }}
          </div>

          <div class="user-info">
            <h3>{{ user.name }}</h3>

            <p>
              <strong>Email:</strong>
              {{ user.email }}
            </p>

            <p>
              <strong>Phone:</strong>
              {{ user.phone }}
            </p>
          </div>

          <div class="user-details">

            <span class="role">
              {{ user.role }}
            </span>

            <p>
              Joined:
              {{ formatDate(user.createdAt) }}
            </p>

          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const users = ref([])
const loading = ref(false)
const message = ref('')
const error = ref('')

const fetchUsers = async () => {
  loading.value = true
  error.value = ''
  message.value = ''

  try {
    const token = localStorage.getItem('token')

    const response = await fetch(
      'http://localhost:4000/api/admin/users',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch users')
    }

    users.value = data

  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  if (!date) return '-'

  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const getInitials = (name) => {
  if (!name) return 'U'

  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const goToDashboard = () => {
  router.push('/admin')
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.users-page {
  min-height: 100vh;
  padding: 40px 60px;
  background: #f5f7fa;
  color: #111827;
}

/* Header */

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;
  margin-bottom: 30px;
}

.page-label {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #2563eb;
}

h1 {
  margin: 0;
  font-size: 36px;
  font-weight: 800;
}

.subtitle {
  margin-top: 8px;
  color: #6b7280;
  font-size: 15px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.refresh-btn,
.back-btn {
  border: none;
  border-radius: 10px;
  padding: 12px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.refresh-btn {
  background: #2563eb;
  color: white;
}

.refresh-btn:hover {
  background: #1d4ed8;
}

.back-btn {
  background: #111827;
  color: white;
}

.back-btn:hover {
  background: #1f2937;
}

/* Messages */

.message {
  padding: 13px 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 14px;
}

.success {
  background: #dcfce7;
  color: #166534;
}

.error {
  background: #fee2e2;
  color: #991b1b;
}

/* Stats */

.stats-card {
  background: white;
  border-radius: 18px;
  padding: 25px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 25px rgba(15, 23, 42, 0.06);
  margin-bottom: 25px;
  max-width: 400px;
}

.stats-label {
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
  letter-spacing: 1px;
}

.stats-card h2 {
  margin: 8px 0 0;
  font-size: 32px;
}

.user-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: #eff6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
}

/* Users card */

.users-card {
  background: white;
  border-radius: 18px;
  padding: 28px;
  box-shadow: 0 8px 25px rgba(15, 23, 42, 0.06);
}

.card-header {
  margin-bottom: 20px;
}

.card-header h2 {
  margin: 0;
  font-size: 22px;
}

.card-header p {
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 14px;
}

/* User row */

.user-row {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid #e5e7eb;
}

.user-row:last-child {
  border-bottom: none;
}

.avatar {
  width: 52px;
  height: 52px;
  min-width: 52px;
  border-radius: 50%;
  background: #111827;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.user-info {
  flex: 1;
}

.user-info h3 {
  margin: 0 0 8px;
  font-size: 17px;
}

.user-info p {
  margin: 4px 0;
  color: #6b7280;
  font-size: 14px;
}

.user-details {
  text-align: right;
  min-width: 150px;
}

.role {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 20px;
  background: #dcfce7;
  color: #166534;
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
}

.user-details p {
  margin: 10px 0 0;
  color: #6b7280;
  font-size: 13px;
}

/* Loading / Empty */

.loading,
.empty {
  padding: 40px;
  text-align: center;
  color: #6b7280;
}

/* Responsive */

@media (max-width: 768px) {
  .users-page {
    padding: 25px 20px;
  }

  .page-header {
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
  }

  .refresh-btn,
  .back-btn {
    flex: 1;
  }

  .user-row {
    align-items: flex-start;
  }

  .user-details {
    min-width: auto;
  }
}

@media (max-width: 600px) {
  .user-row {
    flex-wrap: wrap;
  }

  .user-details {
    width: 100%;
    text-align: left;
    margin-left: 72px;
  }
}
</style>