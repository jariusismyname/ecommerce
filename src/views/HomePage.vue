<template>
  <div class="home-container">
    <div class="home-card">
      <h1>Welcome Home</h1>
      <div class="button-group">
        <button @click="logout" class="home-button logout">Logout</button>
        <button @click="goToProducts" class="home-button">Add to Cart</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = async () => {
  await signOut(auth)
  router.push('/login')
}

const goToProducts = () => {
  router.push('/products') // Make sure this matches your route
}
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #e8f5e9;
}

.home-card {
  background-color: #ffffff;
  padding: 2.5rem 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 128, 0, 0.1);
  text-align: center;
}

h1 {
  color: #2e7d32;
  margin-bottom: 2rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.home-button {
  background-color: #4caf50;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.home-button:hover {
  background-color: #388e3c;
}

.logout {
  background-color: #e53935;
}

.logout:hover {
  background-color: #c62828;
}
</style>
