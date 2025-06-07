<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Register</h2>
      <input v-model="email" placeholder="Email" class="input" />
      <input v-model="password" type="password" placeholder="Password" class="input" />
      <button @click="register" class="register-button">Register</button>

      <p class="small-text">
        Already have an account?
        <router-link to="/login" class="link">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const register = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    router.push('/home')
  } catch (err) {
    alert(err.message)
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #e8f5e9;
}

.register-card {
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

.register-button {
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

.register-button:hover {
  background-color: #388e3c;
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
