<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Login</h2>
      <input v-model="email" placeholder="Email" class="input" />
      <input v-model="password" type="password" placeholder="Password" class="input" />
      <button @click="login" class="login-button">Login</button>

      <p class="small-text">
        Don't have an account?
        <router-link to="/register" class="link">Register</router-link>
      </p>

      <!-- Admin Login Button -->
      <p class="small-text">
        Are you an admin?
        <button @click="goToAdminLogin" class="admin-button">Go to Admin Login</button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

const email = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/home')
  } catch (err) {
    alert(err.message)
  }
}

const goToAdminLogin = () => {
  router.push('/admin-login')
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #e6f4ea;
}

.login-card {
  background-color: #ffffff;
  padding: 2.5rem 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 128, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

h2 {
  margin-bottom: 1.5rem;
  color: #2e7d32;
}

.input {
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #c8e6c9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.input:focus {
  outline: none;
  border-color: #66bb6a;
}

.login-button {
  width: 100%;
  background-color: #4caf50;
  color: white;
  padding: 0.75rem;
  margin-top: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #388e3c;
}

.admin-button {
  background-color: transparent;
  color: #388e3c;
  border: none;
  font-weight: bold;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s;
}

.admin-button:hover {
  color: #1b5e20;
  text-decoration: underline;
}

.link {
  color: #2e7d32;
  text-decoration: none;
  font-weight: bold;
}

.link:hover {
  text-decoration: underline;
}

.small-text {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #555;
}
</style>
