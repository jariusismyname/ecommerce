<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Admin Login</h2>
      <input
        v-model="adminPassword"
        type="password"
        placeholder="Enter Admin Password"
        class="input"
      />
      <button @click="adminLogin" class="login-button">Login</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const adminPassword = ref('')
const errorMessage = ref('')
const router = useRouter()

const adminLogin = () => {
  if (adminPassword.value === 'connectedisme1234') {
    router.push('/products-stocks')
  } else {
    errorMessage.value = 'Incorrect admin password.'
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  background-color: white;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.input {
  width: 100%;
  padding: 0.75rem;
  margin: 1rem 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.login-button {
  background-color: #2ecc71;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  margin-top: 1rem;
}
</style>
